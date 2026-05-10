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

type ImportMode = "upsert" | "replace";

function parseArgs() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  const modeArg = args.find((arg) => arg.startsWith("--mode="));
  const rawMode = modeArg ? modeArg.split("=")[1] : "upsert";
  const mode: ImportMode = rawMode === "replace" ? "replace" : "upsert";

  return { dryRun, mode };
}

async function importProducts() {
  try {
    const { dryRun, mode } = parseArgs();

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
    const idSet = new Set<string>();
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

    // Prepare products with normalized image URLs
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

    console.log("Import summary:");
    console.log(`- mode: ${mode}${dryRun ? " (dry-run)" : ""}`);
    console.log(`- input rows: ${jsonData.data.length}`);
    console.log(`- unique ids: ${idSet.size}`);
    console.log(`- duplicate id rows: ${duplicateIds.length}`);

    if (dryRun) {
      console.log("Dry-run enabled: no database changes were made.");
      process.exit(0);
    }

    // Connect to MongoDB only when writes are enabled
    await connectDB();

    if (mode === "replace") {
      // Explicitly destructive mode (opt-in only)
      await Product.deleteMany({});
      console.log("Cleared existing products");
    }

    try {
      if (mode === "replace") {
        await Product.insertMany(products, { ordered: false });
        console.log(
          `Write summary: inserted ${products.length} products (replace mode).`
        );
      } else {
        const operations = products.map((product) => ({
          updateOne: {
            filter: { id: product.id },
            update: { $set: product },
            upsert: true,
          },
        }));
        const result = await Product.bulkWrite(operations, { ordered: false });
        console.log("Write summary (upsert mode):");
        console.log(`- matched: ${result.matchedCount}`);
        console.log(`- modified: ${result.modifiedCount}`);
        console.log(`- upserted: ${result.upsertedCount}`);
      }
    } catch (writeErr: any) {
      if (writeErr.writeErrors) {
        console.error(`Write errors (${writeErr.writeErrors.length}):`);
      } else {
        console.error("Error writing products:", writeErr);
      }
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error importing products:", error);
    process.exit(1);
  }
}

importProducts();
