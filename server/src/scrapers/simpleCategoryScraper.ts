import { chromium } from "playwright";

interface Category {
  name: string;
  url: string;
  id: string;
}

async function extractCategories() {
  console.log("🚀 Starting simple category scraper...");

  // Launch browser with additional options
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
    ],
  });

  try {
    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.setExtraHTTPHeaders({
      "Accept-Language": "he-IL,he;q=0.9,en;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    // Try multiple URLs
    const urlsToTry = [
      "https://ben-gigi.co.il/",
      "https://ben-gigi.co.il/דף-הבית",
      "https://ben-gigi.co.il/%D7%93%D7%A3-%D7%94%D7%91%D7%99%D7%AA",
    ];

    let pageLoaded = false;
    let currentUrl = "";

    for (const url of urlsToTry) {
      try {
        console.log(`🌐 Trying URL: ${url}`);

        await page.goto(url, {
          waitUntil: "domcontentloaded", // Changed from 'networkidle' to be less strict
          timeout: 20000, // Reduced timeout
        });

        // Wait a bit for the page to settle
        await page.waitForTimeout(3000);

        currentUrl = url;
        pageLoaded = true;
        console.log("✅ Page loaded successfully!");
        break;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`❌ Failed to load ${url}: ${errorMessage}`);
        continue;
      }
    }

    if (!pageLoaded) {
      throw new Error("Could not load any of the URLs");
    }

    console.log("📄 Page loaded, taking screenshot for debugging...");
    await page.screenshot({
      path: "./screenshots/homepage-debug.png",
      fullPage: true,
    });

    console.log("🔍 Looking for menu elements...");

    // Try multiple selectors for the menu
    const menuSelectors = [
      "ul.sf-menu",
      ".sf-menu",
      "#DDMenuTop",
      "ul.sf-menu-rtl",
      "nav ul",
      ".menu ul",
    ];

    let menuFound = false;
    let categories: Category[] = [];

    for (const selector of menuSelectors) {
      try {
        console.log(`🔍 Trying selector: ${selector}`);
        await page.waitForSelector(selector, { timeout: 5000 });
        console.log(`✅ Found menu with selector: ${selector}`);
        menuFound = true;

        // Extract menu items
        categories = await page.evaluate((sel) => {
          const menuLinks = document.querySelectorAll(`${sel} a`);
          const results: Category[] = [];

          console.log(`Found ${menuLinks.length} links in menu`);

          menuLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            const text = link.textContent?.trim() || "";
            const id = link.getAttribute("id") || "";

            console.log(`Link: ${text} -> ${href}`);

            // Filter for product categories
            if (
              href.includes("/מוצרים/") ||
              text.includes("אביזר") ||
              text.includes("מכונ") ||
              text.includes("שטיפ") ||
              text.includes("ניקוי") ||
              text.includes("שואב") ||
              text.includes("R+M") ||
              text.includes("מחבר") ||
              text.includes("סביבל")
            ) {
              results.push({
                name: text,
                url: href.startsWith("http")
                  ? href
                  : `https://ben-gigi.co.il${href}`,
                id: id,
              });
            }
          });

          return results;
        }, selector);

        if (categories.length > 0) {
          break;
        }
      } catch (error) {
        console.log(`❌ Selector ${selector} not found`);
        continue;
      }
    }

    if (!menuFound) {
      console.log(
        "🔍 No menu found with standard selectors, trying to find any navigation links..."
      );

      // Fallback: look for any links that might be categories
      categories = await page.evaluate(() => {
        const allLinks = document.querySelectorAll("a");
        const results: Category[] = [];

        allLinks.forEach((link) => {
          const href = link.getAttribute("href") || "";
          const text = link.textContent?.trim() || "";
          const id = link.getAttribute("id") || "";

          // Look for product-related URLs or text
          if (
            href.includes("/מוצרים/") ||
            href.includes("product") ||
            text.includes("אביזר") ||
            text.includes("מכונ") ||
            text.includes("שטיפ") ||
            text.includes("ניקוי") ||
            text.includes("שואב") ||
            text.includes("R+M") ||
            text.includes("מחבר") ||
            text.includes("סביבל")
          ) {
            results.push({
              name: text,
              url: href.startsWith("http")
                ? href
                : `https://ben-gigi.co.il${href}`,
              id: id,
            });
          }
        });

        return results;
      });
    }

    console.log(`🎯 Found ${categories.length} product categories:`);
    console.log("==========================================");

    if (categories.length === 0) {
      console.log(
        "⚠️  No categories found. Let me dump all links for debugging..."
      );

      const allLinks = await page.evaluate(() => {
        const links = document.querySelectorAll("a");
        return Array.from(links)
          .slice(0, 20)
          .map((link) => ({
            text: link.textContent?.trim() || "",
            href: link.getAttribute("href") || "",
            id: link.getAttribute("id") || "",
          }));
      });

      console.log("🔍 First 20 links found on page:");
      allLinks.forEach((link, i) => {
        console.log(`${i + 1}. "${link.text}" -> ${link.href}`);
      });
    } else {
      categories.forEach((category, index) => {
        console.log(`${index + 1}. ${category.name}`);
        console.log(`   URL: ${category.url}`);
        console.log(`   ID: ${category.id}`);
        console.log("");
      });
    }

    // Save to file regardless
    const fs = require("fs");
    const outputDir = "./scraped-data";
    const screenshotsDir = "./screenshots";

    // Create directories
    [outputDir, screenshotsDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    const result = {
      success: categories.length > 0,
      timestamp: new Date().toISOString(),
      source: currentUrl,
      categories: categories,
      totalFound: categories.length,
    };

    const outputFile = `${outputDir}/categories-simple.json`;
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), "utf8");

    console.log(`💾 Results saved to: ${outputFile}`);
    console.log(`📸 Screenshot saved to: ./screenshots/homepage-debug.png`);

    if (categories.length > 0) {
      console.log("🎉 Scraping completed successfully!");
    } else {
      console.log(
        "⚠️  Scraping completed but no categories found. Check the screenshot for debugging."
      );
    }

    return categories;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error during scraping:", errorMessage);
    throw error;
  } finally {
    await browser.close();
    console.log("🔄 Browser closed");
  }
}

// Run if executed directly
if (require.main === module) {
  extractCategories().catch(console.error);
}

export { extractCategories };
