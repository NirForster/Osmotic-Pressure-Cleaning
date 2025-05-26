import { ProductScraper } from "./extractProducts";
import { ScraperUtils } from "./scraperUtils";
import { ProductCategory } from "./extractCategories";
import * as fs from "fs";
import * as path from "path";

interface ProgressStats {
  totalCategories: number;
  processedCategories: number;
  totalProducts: number;
  processedProducts: number;
  successfulProducts: number;
  failedProducts: number;
  startTime: Date;
  currentCategory?: string;
  currentProduct?: string;
}

async function loadCategories(): Promise<ProductCategory[]> {
  try {
    const categoriesPath = path.join(
      process.cwd(),
      "scraped-data",
      "categories.json"
    );
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));
    return categoriesData.data;
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
}

function formatDuration(startTime: Date): string {
  const duration = Date.now() - startTime.getTime();
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
}

function updateProgress(stats: ProgressStats) {
  const progress = {
    categories: `${stats.processedCategories}/${stats.totalCategories}`,
    products: `${stats.processedProducts}/${stats.totalProducts}`,
    success: stats.successfulProducts,
    failed: stats.failedProducts,
    duration: formatDuration(stats.startTime),
    current: stats.currentCategory ? `Category: ${stats.currentCategory}` : "",
    currentProduct: stats.currentProduct
      ? `Product: ${stats.currentProduct}`
      : "",
  };

  // Clear previous progress
  process.stdout.write("\x1Bc");

  console.log("\n🔄 Scraping Progress");
  console.log("==================");
  console.log(
    `📚 Categories: ${progress.categories} (${(
      (stats.processedCategories / stats.totalCategories) *
      100
    ).toFixed(1)}%)`
  );
  console.log(
    `📦 Products: ${progress.products} (${(
      (stats.processedProducts / stats.totalProducts) *
      100
    ).toFixed(1)}%)`
  );
  console.log(`✅ Successful: ${progress.success}`);
  console.log(`❌ Failed: ${progress.failed}`);
  console.log(`⏱️  Duration: ${progress.duration}`);
  console.log(`\n📍 Current: ${progress.current}`);
  if (progress.currentProduct) {
    console.log(`   ${progress.currentProduct}`);
  }
  console.log("\n");
}

async function main() {
  const scraper = new ProductScraper();
  const allProducts = [];
  const stats: ProgressStats = {
    totalCategories: 0,
    processedCategories: 0,
    totalProducts: 0,
    processedProducts: 0,
    successfulProducts: 0,
    failedProducts: 0,
    startTime: new Date(),
  };

  try {
    // Load categories from the saved JSON file
    const categories = await loadCategories();
    stats.totalCategories = categories.length;
    console.log(`📚 Loaded ${categories.length} categories to process`);

    // Initialize the browser
    await scraper.init(false); // Set to true for headless mode

    // Set up progress callback
    scraper.setProgressCallback((productName) => {
      stats.currentProduct = productName;
      updateProgress(stats);
    });

    // Process each category
    for (const [index, category] of categories.entries()) {
      stats.currentCategory = category.name;
      updateProgress(stats);

      try {
        const result = await scraper.extractProducts(category);
        stats.processedCategories++;

        if (result.success) {
          stats.successfulProducts += result.data.length;
          allProducts.push(...result.data);
        } else {
          stats.failedProducts += result.totalProducts || 0;
        }

        stats.processedProducts += result.totalProducts || 0;
        updateProgress(stats);

        // Add a small delay between categories to be nice to the server
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`❌ Error processing category ${category.name}:`, error);
        stats.failedProducts++;
        stats.processedCategories++;
        updateProgress(stats);
      }
    }

    // Save all products to a single file
    const finalResult = {
      success: true,
      data: allProducts,
      timestamp: new Date(),
      totalProducts: allProducts.length,
      totalCategories: categories.length,
      stats: {
        successfulProducts: stats.successfulProducts,
        failedProducts: stats.failedProducts,
        duration: formatDuration(stats.startTime),
      },
    };

    await ScraperUtils.saveToFile(finalResult, "all-products.json");

    // Print final summary
    ScraperUtils.logSection("Final Summary");
    console.log(`✅ Total categories processed: ${categories.length}`);
    console.log(`📦 Total products scraped: ${allProducts.length}`);
    console.log(`✅ Successful products: ${stats.successfulProducts}`);
    console.log(`❌ Failed products: ${stats.failedProducts}`);
    console.log(`⏱️  Total duration: ${formatDuration(stats.startTime)}`);
    console.log(`🕐 Timestamp: ${finalResult.timestamp.toISOString()}`);
    console.log(`💾 All products saved to: all-products.json`);
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
