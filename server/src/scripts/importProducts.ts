import * as fs from "fs";
import * as path from "path";
import { connectDB } from "../config/database";
import { Product } from "../models/Product";

const BASE_URL = "https://ben-gigi.co.il/";

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

    // Check for duplicate IDs in the JSON
    const idSet = new Set();
    const duplicateIds: string[] = [];
    for (const product of jsonData.data) {
      if (idSet.has(product.id)) {
        duplicateIds.push(product.id);
      } else {
        idSet.add(product.id);
      }
    }
    if (duplicateIds.length > 0) {
      console.warn(`Duplicate IDs found in JSON:`, duplicateIds);
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new products with full image URLs
    const products = jsonData.data.map((product) => ({
      name: product.name,
      url: product.url,
      id: product.id,
      sku: product.sku,
      images: (product.images || []).map((img) =>
        img.startsWith("http") ? img : BASE_URL + img
      ),
      previewImage:
        product.previewImage && !product.previewImage.startsWith("http")
          ? BASE_URL + product.previewImage
          : product.previewImage,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      description: product.description,
      pdfUrl: product.pdfUrl || "",
      videoUrl: product.videoUrl || "",
      subHeader: product.subHeader || "",
      bulletPoints: product.bulletPoints || [],
    }));

    try {
      await Product.insertMany(products, { ordered: false });
      console.log(`Successfully imported ${products.length} products`);
    } catch (insertErr: any) {
      if (insertErr.writeErrors) {
        console.error(`Insert errors (${insertErr.writeErrors.length}):`);
        insertErr.writeErrors.forEach((err: any) => {
          console.error(
            `Error for product with id=${err.err.op.id}: ${err.errmsg}`
          );
        });
        const successful = products.length - insertErr.writeErrors.length;
        console.log(
          `Successfully imported ${successful} products, ${insertErr.writeErrors.length} failed.`
        );
      } else {
        console.error("Error inserting products:", insertErr);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error importing products:", error);
    process.exit(1);
  }
}

importProducts();
