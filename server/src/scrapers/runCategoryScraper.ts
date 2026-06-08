import { CategoryScraper, ProductCategory } from "./extractCategories";
import { ScrapingResult } from "./scraperUtils";

async function runCategoryScraper(): Promise<ProductCategory[]> {
  console.log("🎬 Starting Ben Gigi Category Scraper");
  console.log("=====================================\n");

  const scraper = new CategoryScraper();

  try {
    await scraper.init(false); // false = visible browser, true = headless

    const startTime = Date.now();

    const result: ScrapingResult<ProductCategory> =
      await scraper.extractCategories();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log("\n📈 SCRAPING SUMMARY");
    console.log("==================");
    console.log(`⏱️  Duration: ${duration.toFixed(2)} seconds`);
    console.log(`📦 Categories found: ${result.data.length}`);
    console.log(`🌍 Source URL: https://ben-gigi.co.il/דף-הבית`);

    console.log("\n🗂️  EXTRACTED CATEGORIES");
    console.log("========================");

    result.data.forEach((category: ProductCategory, index: number) => {
      console.log(`\n${index + 1}. 📁 ${category.name}`);
      console.log(`   🔗 ${category.url}`);
      console.log(`   🆔 ${category.id}`);
    });

    // Additional analysis
    console.log("\n🔍 CATEGORY ANALYSIS");
    console.log("====================");

    const categoryTypes = {
      accessories: result.data.filter((c: ProductCategory) =>
        c.name.includes("אביזר")
      ),
      machines: result.data.filter((c: ProductCategory) =>
        c.name.includes("מכונ")
      ),
      professional: result.data.filter((c: ProductCategory) =>
        c.name.includes("מקצועי")
      ),
      vacuum: result.data.filter((c: ProductCategory) =>
        c.name.includes("שואב")
      ),
      brands: result.data.filter((c: ProductCategory) =>
        c.name.includes("R+M")
      ),
      connectors: result.data.filter(
        (c: ProductCategory) =>
          c.name.includes("מחבר")
      ),
    };

    Object.entries(categoryTypes).forEach(([type, items]) => {
      if (items.length > 0) {
        console.log(`${type}: ${items.length} categories`);
      }
    });

    return result.data;
  } catch (error) {
    console.error("\n💥 SCRAPING FAILED");
    console.error("==================");
    console.error(error);
    return [];
  } finally {
    await scraper.close();
    console.log("\n🏁 Scraper finished");
  }
}

// Run the scraper
if (require.main === module) {
  runCategoryScraper();
}

export { runCategoryScraper };
