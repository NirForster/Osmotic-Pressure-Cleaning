import * as fs from "fs";
import * as path from "path";

interface Product {
  name: string;
  url: string;
  id: string;
  sku: string;
  images: string[];
  categoryId: string;
  categoryName: string;
}

interface ScrapingResult<T> {
  success: boolean;
  data: T[];
  timestamp: string;
  totalProducts?: number;
  totalCategories?: number;
}

async function analyzeProducts() {
  try {
    // Read the all-products.json file
    const productsPath = path.join(
      process.cwd(),
      "scraped-data",
      "all-products.json"
    );
    const productsData: ScrapingResult<Product> = JSON.parse(
      fs.readFileSync(productsPath, "utf-8")
    );

    // Group products by category
    const categoryCounts = productsData.data.reduce((acc, product) => {
      const categoryName = product.categoryName;
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Print the results
    console.log("\n📊 Product Counts by Category");
    console.log("===========================");

    Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a) // Sort by count descending
      .forEach(([category, count]) => {
        console.log(`\n${category}:`);
        console.log(`   Products: ${count}`);
      });

    console.log("\n📈 Summary");
    console.log("==========");
    console.log(`Total Categories: ${Object.keys(categoryCounts).length}`);
    console.log(`Total Products: ${productsData.data.length}`);
    console.log(
      `Average Products per Category: ${(
        productsData.data.length / Object.keys(categoryCounts).length
      ).toFixed(1)}`
    );
  } catch (error) {
    console.error("Error analyzing products:", error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  analyzeProducts();
}
