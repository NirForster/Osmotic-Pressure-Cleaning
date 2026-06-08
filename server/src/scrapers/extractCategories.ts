import { chromium, Browser, Page } from "playwright";
import { ScraperUtils, ScrapingResult } from "./scraperUtils";

interface ProductCategory {
  name: string;
  url: string;
  id: string;
  categoryType?: string;
}

class CategoryScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseUrl: string = "https://ben-gigi.co.il";
  private maxRetries: number = 3;
  private retryDelay: number = 5000; // 5 seconds

  async init(headless: boolean = false) {
    ScraperUtils.logSection("Initializing Browser");

    this.browser = await chromium.launch({
      headless,
      slowMo: headless ? 0 : 1000,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    this.page = await this.browser.newPage();

    // Set viewport and headers
    await this.page.setViewportSize({ width: 1280, height: 720 });
    await this.page.setExtraHTTPHeaders({
      "Accept-Language": "he-IL,he;q=0.9,en;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    });

    console.log("✅ Browser initialized successfully");
    console.log(`🔍 Headless mode: ${headless}`);
  }

  private async waitForPageLoad(url: string): Promise<boolean> {
    if (!this.page) throw new Error("Browser not initialized");

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${this.maxRetries} to load page...`);

        // Navigate with a more lenient wait condition
        await this.page.goto(url, {
          waitUntil: "domcontentloaded", // Changed from networkidle
          timeout: 60000, // 60 seconds
        });

        // Wait for the menu to be present in the DOM
        await this.page.waitForSelector("ul.sf-menu.sf-menu-rtl", {
          timeout: 30000,
          state: "attached", // Changed from visible to attached
        });

        // Give a small delay for any dynamic content
        await this.page.waitForTimeout(2000);

        console.log("✅ Page loaded successfully");
        return true;
      } catch (error) {
        console.log(
          `❌ Attempt ${attempt} failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );

        if (attempt < this.maxRetries) {
          console.log(
            `Waiting ${this.retryDelay / 1000} seconds before retry...`
          );
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    return false;
  }

  async extractCategories(): Promise<ScrapingResult<ProductCategory>> {
    if (!this.page) {
      throw new Error("Browser not initialized. Call init() first.");
    }

    const startTime = Date.now();
    const url = `${this.baseUrl}/דף-הבית`;

    ScraperUtils.logSection("Extracting Categories");
    console.log(`🌐 Target URL: ${url}`);

    try {
      // Try to load the page with retries
      const pageLoaded = await this.waitForPageLoad(url);
      if (!pageLoaded) {
        throw new Error("Failed to load page after multiple attempts");
      }

      // Take initial screenshot
      await ScraperUtils.takeScreenshot(this.page, "homepage-loaded");

      console.log("✅ Menu found, extracting categories...");

      // Wait for menu to be fully interactive
      await this.page.waitForTimeout(2000); // Give extra time for any animations

      // Debug: Log the raw HTML of the menu
      const menuHtml = await this.page.$eval(
        "ul.sf-menu.sf-menu-rtl",
        (el) => el.innerHTML
      );
      console.log("🔍 Menu HTML:", menuHtml);

      // Extract all menu items with enhanced selector and debugging
      const menuItems = await this.page.$$eval(
        "ul.sf-menu.sf-menu-rtl li a",
        (elements) => {
          return elements.map((element) => {
            // Debug each element
            console.log("Element:", {
              href: element.getAttribute("href"),
              text: element.textContent,
              id: element.getAttribute("id"),
              onclick: element.getAttribute("onclick"),
              class: element.getAttribute("class"),
            });

            const href = element.getAttribute("href") || "";
            const text = element.textContent?.trim() || "";
            const id = element.getAttribute("id") || "";

            return {
              name: text,
              url: href,
              id: id,
            };
          });
        }
      );

      // If we didn't get any hrefs, try clicking and getting URLs
      if (menuItems.some((item) => !item.url)) {
        console.log(
          "⚠️ Some menu items missing URLs, trying click-based approach..."
        );

        const menuElements = await this.page.$$("ul.sf-menu.sf-menu-rtl li a");
        const newMenuItems = [];

        for (const element of menuElements) {
          try {
            // Get the text and id first
            const text = (await element.textContent()) || "";
            const id = (await element.getAttribute("id")) || "";

            // Click the element
            await element.click();
            await this.page.waitForTimeout(1000); // Wait for navigation

            // Get the current URL
            const url = this.page.url();

            // Go back
            await this.page.goBack();
            await this.page.waitForTimeout(1000); // Wait for navigation

            newMenuItems.push({
              name: text.trim(),
              url: url,
              id: id,
            });
          } catch (error) {
            console.error("Error processing menu item:", error);
          }
        }

        if (newMenuItems.length > 0) {
          console.log(
            "✅ Successfully extracted URLs using click-based approach"
          );
          menuItems.length = 0; // Clear the array
          menuItems.push(...newMenuItems);
        }
      }

      console.log(`📋 Found ${menuItems.length} total menu items`);

      // Enhanced filtering for product categories
      const productCategories = menuItems
        .filter((item: ProductCategory) => {
          const isProductCategory =
            item.url.includes("/מוצרים/") || this.isProductRelated(item.name);

          return (
            isProductCategory &&
            item.name.length > 0 &&
            !item.name.includes("דף הבית") &&
            !item.name.includes("אודות") &&
            !item.name.includes("צור קשר") &&
            !item.name.includes("מאמרים")
          );
        })
        .map((item: ProductCategory) => ({
          ...item,
          url: ScraperUtils.normalizeUrl(item.url, this.baseUrl),
          categoryType: this.categorizeProduct(item.name),
        }));

      const endTime = Date.now();
      const duration = endTime - startTime;

      ScraperUtils.logSubSection("Extracted Categories");
      productCategories.forEach((category: ProductCategory, index: number) => {
        console.log(`   ${index + 1}. 📁 ${category.name}`);
        console.log(`      🔗 ${category.url}`);
        console.log(`      🏷️  Type: ${category.categoryType}`);
        console.log(`      🆔 ${category.id}`);
        console.log("");
      });

      // Save results
      const result: ScrapingResult<ProductCategory> = {
        success: true,
        data: productCategories,
        timestamp: new Date(),
        duration,
        source: url,
      };

      await ScraperUtils.saveToFile(result, "categories.json");

      return result;
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      await ScraperUtils.handleError(error, "Category Extraction");

      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
        duration,
        source: url,
      };
    }
  }

  private isProductRelated(name: string): boolean {
    const productKeywords = [
      "אביזר",
      "מכונ",
      "שטיפ",
      "ניקוי",
      "מקצועי",
      "שואב",
      "אבק",
      "מחבר",
      "R+M",
      "לחץ",
    ];

    return productKeywords.some((keyword) => name.includes(keyword));
  }

  private categorizeProduct(name: string): string {
    if (name.includes("אביזר")) return "accessories";
    if (name.includes("מכונ")) return "machines";
    if (name.includes("מקצועי")) return "professional";
    if (name.includes("שואב")) return "vacuum";
    if (name.includes("R+M")) return "brand";
    if (name.includes("מחבר")) return "connectors";
    return "other";
  }

  async close() {
    if (this.browser) {
      console.log("🔄 Closing browser...");
      await this.browser.close();
      console.log("✅ Browser closed");
    }
  }
}

// Main execution function
async function main() {
  const scraper = new CategoryScraper();

  try {
    await scraper.init(false); // Set to true for headless mode

    const result = await scraper.extractCategories();

    ScraperUtils.logSection("Scraping Summary");
    console.log(`✅ Success: ${result.success}`);
    console.log(`⏱️  Duration: ${(result.duration / 1000).toFixed(2)} seconds`);
    console.log(`📦 Categories found: ${result.data.length}`);
    console.log(`🕐 Timestamp: ${result.timestamp.toISOString()}`);

    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    }

    return result;
  } catch (error) {
    await ScraperUtils.handleError(error, "Main Execution");
  } finally {
    await scraper.close();
  }
}

// Export for use in other modules
export { CategoryScraper, ProductCategory };

// Run if this file is executed directly
if (require.main === module) {
  main();
}
