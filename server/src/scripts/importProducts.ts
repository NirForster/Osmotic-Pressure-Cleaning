import * as fs from "fs";
import * as path from "path";
import { connectDB } from "../config/database";
import { Product } from "../models/Product";

interface ProductData {
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

interface ScrapingResult {
  success: boolean;
  data: ProductData[];
  timestamp: string;
  category?: string;
  totalProducts?: number;
}

async function importProducts() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Read the JSON file
    const jsonPath = path.join(
      __dirname,
      "../../scraped-data/all-products.json"
    );
    const jsonData = JSON.parse(
      fs.readFileSync(jsonPath, "utf-8")
    ) as ScrapingResult;

    if (!jsonData.success || !jsonData.data) {
      throw new Error("Invalid JSON data format");
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new products
    const products = jsonData.data.map((product) => ({
      name: product.name,
      url: product.url,
      id: product.id,
      sku: product.sku,
      images: product.images,
      previewImage: product.previewImage,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      description: product.description,
      pdfUrl: product.pdfUrl || "",
      videoUrl: product.videoUrl || "",
      subHeader: product.subHeader || "",
      bulletPoints: product.bulletPoints || [],
    }));

    await Product.insertMany(products);
    console.log(`Successfully imported ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error("Error importing products:", error);
    process.exit(1);
  }
}

importProducts();
