import { chromium, Browser, Page } from "playwright";
import { ScraperUtils } from "./scraperUtils";
import { ProductCategory } from "./extractCategories";

interface Product {
  name: string;
  url: string;
  id: string;
  sku: string;
  images: string[];
  previewImage: string;
  categoryId: string;
  categoryName: string;
  description: string;
  pdfUrl?: string;
  videoUrl?: string;
  subHeader?: string;
  bulletPoints?: string[];
}

interface ScrapingResult<T> {
  success: boolean;
  data: T[];
  timestamp: Date;
  category?: string;
  totalProducts?: number;
  error?: string;
}

interface ProgressCallback {
  (productName: string): void;
}

class ProductScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private onProductProgress?: ProgressCallback;

  async init(headless: boolean = true) {
    this.browser = await chromium.launch({ headless });
    this.page = await this.browser.newPage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  setProgressCallback(callback: ProgressCallback) {
    this.onProductProgress = callback;
  }

  private async extractProductDetails(
    page: Page,
    productUrl: string
  ): Promise<Partial<Product>> {
    try {
      await page.goto(productUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForSelector(".CssCatProductAdjusted_product", {
        timeout: 10000,
      });

      // Extract product name
      const name = await page.$eval(
        ".CssCatProductAdjusted_header span",
        (el) => el.textContent?.trim() || ""
      );

      // Extract subheader as the first <p> in span[itemprop='description']
      let subHeader = "";
      try {
        subHeader = await page.$eval(
          'span[itemprop="description"] > p:first-of-type',
          (el) => el.textContent?.trim() || ""
        );
      } catch {}

      // Extract description as the rest of the <p>s in span[itemprop='description']
      let description = "";
      try {
        const ps = await page.$$eval(
          'span[itemprop="description"] > p:not(:first-of-type)',
          (els) => els.map((el) => el.textContent?.trim() || "").filter(Boolean)
        );
        description = ps.join(" ");
      } catch {}

      // Extract bullet points (if present)
      let bulletPoints: string[] = [];
      try {
        bulletPoints = await page.$$eval(
          ".CssCatProductAdjusted_product ul li",
          (els) => els.map((el) => el.textContent?.trim() || "")
        );
      } catch {}

      // Extract PDF link using provided XPath
      let pdfUrl = "";
      try {
        const pdfLocator = page.locator(
          "xpath=/html/body/div[1]/div/div/main/div[3]/form/span/div[2]/div[3]/div[1]/span/div/div/div/div/div[2]/a"
        );
        if ((await pdfLocator.count()) > 0) {
          pdfUrl = (await pdfLocator.first().getAttribute("href")) || "";
        }
      } catch {
        try {
          pdfUrl = await page.$eval(
            'a:has-text("PDF")',
            (el: HTMLAnchorElement) => el.href
          );
        } catch {}
      }

      // Extract video link using provided XPath
      let videoUrl = "";
      try {
        const videoLocator = page.locator(
          "xpath=/html/body/div[1]/div/div/main/div[3]/form/span/div[2]/div[3]/div[1]/span/div/div/div/div/div[1]/a"
        );
        if ((await videoLocator.count()) > 0) {
          videoUrl = (await videoLocator.first().getAttribute("href")) || "";
        }
      } catch {
        try {
          videoUrl = await page.$eval(
            'a:has-text("וידאו")',
            (el: HTMLAnchorElement) => el.href
          );
        } catch {}
      }

      // Extract images
      const images = await page.$$eval(".fotorama__img", (imgs) =>
        imgs.map((img) => img.getAttribute("src") || "").filter(Boolean)
      );
      const previewImage = images.length > 0 ? images[0] : "";

      return {
        name,
        subHeader,
        description,
        bulletPoints,
        pdfUrl,
        videoUrl,
        images,
        previewImage,
      };
    } catch (error) {
      console.error(
        `Error extracting product details from ${productUrl}:`,
        error
      );
      return {};
    }
  }

  async extractProducts(
    category: ProductCategory
  ): Promise<ScrapingResult<Product>> {
    try {
      if (!this.page) {
        throw new Error("Browser not initialized");
      }

      // Navigate to the category page
      console.log(`Navigating to category: ${category.url}`);
      await this.page.goto(category.url, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // Wait for initial products to load
      console.log("Waiting for initial products to load...");
      await this.page.waitForSelector(".CssCatalogAdjusted_product", {
        timeout: 10000,
      });

      // Scroll to load all products
      console.log("Scrolling to load all products...");
      let previousHeight = 0;
      let currentHeight = await this.page.evaluate(
        () => document.body.scrollHeight
      );
      let scrollAttempts = 0;
      const maxScrollAttempts = 10;

      while (
        previousHeight !== currentHeight &&
        scrollAttempts < maxScrollAttempts
      ) {
        previousHeight = currentHeight;
        await this.page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        currentHeight = await this.page.evaluate(
          () => document.body.scrollHeight
        );
        scrollAttempts++;
        const currentProducts = await this.page.$$(
          ".CssCatalogAdjusted_product"
        );
        console.log(
          `Found ${currentProducts.length} products after scroll ${scrollAttempts}`
        );
      }

      // Collect all product URLs and basic info from the category page
      const productCards = await this.page.$$(".CssCatalogAdjusted_product");
      console.log(
        `Found ${productCards.length} products with .CssCatalogAdjusted_product`
      );

      type ProductCardInfo = {
        url: string;
        name: string;
        id: string;
        sku: string;
      };
      const productInfos: ProductCardInfo[] = [];

      for (const [index, card] of productCards.entries()) {
        try {
          // Try multiple ways to get the product URL
          let productUrl: string | null = null;
          try {
            productUrl = await card.$eval(
              ".CssCatalogAdjusted_BTNDetails a.details",
              (el: HTMLAnchorElement) => el.href
            );
          } catch (e) {
            try {
              productUrl = await card.$eval(
                ".CssCatalogAdjusted_top a",
                (el: HTMLAnchorElement) => el.href
              );
            } catch (e) {
              try {
                productUrl = await card.$eval(
                  "a",
                  (el: HTMLAnchorElement) => el.href
                );
              } catch (e) {
                console.error(`Could not find URL for product ${index + 1}`);
              }
            }
          }
          if (!productUrl) {
            console.error(`No URL found for product ${index + 1}`);
            continue;
          }

          // Extract basic info from card
          let name = "";
          try {
            name = await card.$eval(
              ".CssCatalogAdjusted_top a",
              (el) => el.textContent?.trim() || ""
            );
          } catch (e) {
            try {
              name = await card.$eval(
                "h3 a",
                (el) => el.textContent?.trim() || ""
              );
            } catch (e) {
              console.error(`Could not find name for product ${index + 1}`);
            }
          }

          let id = "";
          try {
            id = await card.$eval(".CssCatalogAdjusted_top a", (el) => {
              const match = el.getAttribute("href")?.match(/prodid=(\d+)/);
              return match ? match[1] : "";
            });
          } catch {}

          let sku = "";
          try {
            sku = await card.$eval(
              ".CssCatalogAdjusted_Makat .CAT_Values",
              (el) => el.textContent?.trim() || ""
            );
          } catch (e) {
            try {
              sku = await card.$eval(
                ".CssCatalogAdjusted_Makat",
                (el) => el.textContent?.trim() || ""
              );
            } catch (e) {
              console.error(`Could not find SKU for product ${index + 1}`);
            }
          }

          productInfos.push({ url: productUrl, name, id, sku });
        } catch (error) {
          console.error(
            `Error collecting info for product ${index + 1}:`,
            error
          );
        }
      }

      console.log(
        `Collected ${productInfos.length} product URLs for category ${category.name}`
      );

      // Now visit each product page and extract details
      const products: Product[] = [];
      for (const [index, info] of productInfos.entries()) {
        try {
          if (this.onProductProgress) {
            this.onProductProgress(info.name);
          }
          console.log(
            `\nVisiting product ${index + 1}/${productInfos.length}: ${
              info.name
            } (${info.url})`
          );
          const details = await this.extractProductDetails(this.page, info.url);
          products.push({
            name: details.name || info.name,
            url: info.url,
            id: info.id || info.id,
            sku: info.sku || info.sku,
            images: details.images || [],
            previewImage:
              details.previewImage ||
              (details.images && details.images[0]) ||
              "",
            categoryId: category.id,
            categoryName: category.name,
            description: details.description || "",
            pdfUrl: details.pdfUrl,
            videoUrl: details.videoUrl,
            subHeader: details.subHeader,
            bulletPoints: details.bulletPoints,
          });
          console.log(`Extracted details for: ${info.name}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error processing product ${index + 1}:`, error);
          if (error instanceof Error) {
            console.error(error.stack);
          }
        }
      }

      // Save results
      const result: ScrapingResult<Product> = {
        success: true,
        data: products,
        timestamp: new Date(),
        category: category.name,
        totalProducts: products.length,
      };

      console.log(`\nSaving results for category ${category.name}`);
      console.log(`Total products found: ${productInfos.length}`);
      console.log(`Successfully processed: ${products.length}`);

      await ScraperUtils.saveToFile(result, `products-${category.id}.json`);

      return result;
    } catch (error) {
      await ScraperUtils.handleError(error, "Product Scraper");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: [],
        timestamp: new Date(),
      };
    }
  }
}

export { ProductScraper, Product, ScrapingResult };

// Main execution function
async function main() {
  const scraper = new ProductScraper();

  try {
    await scraper.init(false); // Set to true for headless mode

    // Example category - you'll want to load this from your categories.json
    const category: ProductCategory = {
      name: "מכונות שטיפה בלחץ מים",
      url: "https://ben-gigi.co.il/מוצרים/מכונות-שטיפה-בלחץ-מים",
      id: "LI_A_68311",
    };

    const result = await scraper.extractProducts(category);

    ScraperUtils.logSection("Scraping Summary");
    console.log(`✅ Success: ${result.success}`);
    console.log(`📦 Products found: ${result.data.length}`);
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

// Run if this file is executed directly
if (require.main === module) {
  main();
}
