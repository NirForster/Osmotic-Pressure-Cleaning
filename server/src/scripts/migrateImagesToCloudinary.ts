import * as dotenv from "dotenv";
import { connectDB } from "../config/database";
import { Product, IProduct } from "../models/Product";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import { Readable } from "stream";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration
const CONCURRENT_UPLOADS = 5; // Process 5 images at a time
const DOWNLOAD_TIMEOUT = 30000; // 30 seconds timeout for downloads
const CLOUDINARY_FOLDER = "ben-gigi/products";

interface MigrationStats {
  totalScanned: number;
  totalProcessed: number;
  successful: number;
  failed: number;
  skipped: number;
  failures: Array<{ id: string; url: string; reason: string }>;
}

/**
 * Check if a URL already points to Cloudinary
 */
function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com") || url.includes("cloudinary.com");
}

/**
 * Download an image from a URL and return it as a buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: DOWNLOAD_TIMEOUT,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.data) {
      throw new Error("Empty response from image URL");
    }

    return Buffer.from(response.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to download image: ${errorMessage}`);
  }
}

/**
 * Upload an image buffer to Cloudinary
 */
async function uploadToCloudinary(
  imageBuffer: Buffer,
  publicId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: publicId,
        resource_type: "image",
        overwrite: false, // Don't overwrite if already exists
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (!result || !result.secure_url) {
          reject(new Error("Cloudinary upload succeeded but no URL returned"));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const readable = new Readable();
    readable.push(imageBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}

/**
 * Generate a deterministic public_id for Cloudinary from product info
 */
function generatePublicId(product: IProduct, imageIndex?: number): string {
  // Use product id as base, add index if it's from images array
  const baseId = product.id || String(product._id);
  const suffix = imageIndex !== undefined ? `_img${imageIndex}` : "_preview";
  // Remove any characters that might cause issues in Cloudinary public_id
  return baseId.replace(/[^a-zA-Z0-9_-]/g, "_") + suffix;
}

/**
 * Process a single image URL: download and upload to Cloudinary
 */
async function processImage(
  url: string,
  product: IProduct,
  imageIndex?: number
): Promise<string> {
  // Download the image
  const imageBuffer = await downloadImage(url);

  // Generate public_id
  const publicId = generatePublicId(product, imageIndex);

  // Upload to Cloudinary
  const cloudinaryUrl = await uploadToCloudinary(imageBuffer, publicId);

  return cloudinaryUrl;
}

/**
 * Process a single product: migrate all its images
 */
async function processProduct(
  product: IProduct,
  stats: MigrationStats
): Promise<void> {
  const productId = product.id || String(product._id);
  let needsUpdate = false;
  const updateData: any = {};

  try {
    // Process previewImage
    if (product.previewImage && !isCloudinaryUrl(product.previewImage)) {
      console.log(
        `  Processing previewImage for product ${productId}: ${product.previewImage}`
      );
      try {
        const newUrl = await processImage(
          product.previewImage,
          product,
          undefined
        );
        updateData.previewImage = newUrl;
        updateData.oldPreviewImage = product.previewImage; // Store old URL for potential revert
        needsUpdate = true;
        console.log(`  ✓ Preview image migrated: ${newUrl}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        stats.failed++;
        stats.failures.push({
          id: productId,
          url: product.previewImage,
          reason: `Preview image: ${errorMessage}`,
        });
        console.error(
          `  ✗ Failed to migrate preview image for ${productId}: ${errorMessage}`
        );
      }
    } else if (product.previewImage && isCloudinaryUrl(product.previewImage)) {
      console.log(`  Skipping previewImage (already on Cloudinary)`);
      stats.skipped++;
    }

    // Process images array
    if (product.images && product.images.length > 0) {
      const migratedImages: string[] = [];
      const oldImages: string[] = [];

      for (let i = 0; i < product.images.length; i++) {
        const imageUrl = product.images[i];

        if (!imageUrl || imageUrl.trim() === "") {
          // Keep empty strings as-is
          migratedImages.push(imageUrl);
          oldImages.push(imageUrl);
          continue;
        }

        if (isCloudinaryUrl(imageUrl)) {
          // Already on Cloudinary, keep as-is
          migratedImages.push(imageUrl);
          oldImages.push(imageUrl);
          stats.skipped++;
          console.log(`  Skipping images[${i}] (already on Cloudinary)`);
        } else {
          console.log(
            `  Processing images[${i}] for product ${productId}: ${imageUrl}`
          );
          try {
            const newUrl = await processImage(imageUrl, product, i);
            migratedImages.push(newUrl);
            oldImages.push(imageUrl); // Store old URL
            needsUpdate = true;
            console.log(`  ✓ Image ${i} migrated: ${newUrl}`);
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            stats.failed++;
            stats.failures.push({
              id: productId,
              url: imageUrl,
              reason: `Image[${i}]: ${errorMessage}`,
            });
            console.error(
              `  ✗ Failed to migrate image[${i}] for ${productId}: ${errorMessage}`
            );
            // Keep the old URL if migration fails
            migratedImages.push(imageUrl);
            oldImages.push(imageUrl);
          }
        }
      }

      if (needsUpdate) {
        updateData.images = migratedImages;
        updateData.oldImages = oldImages; // Store old URLs for potential revert
      }
    }

    // Update the document if any images were migrated
    if (needsUpdate) {
      await Product.updateOne({ _id: product._id }, { $set: updateData });
      stats.successful++;
      console.log(`✓ Product ${productId} updated successfully`);
    } else {
      console.log(`⊘ Product ${productId} - no images to migrate`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    stats.failed++;
    stats.failures.push({
      id: productId,
      url: "N/A",
      reason: `Product processing error: ${errorMessage}`,
    });
    console.error(`✗ Error processing product ${productId}: ${errorMessage}`);
  }
}

/**
 * Process products in batches with concurrency control
 */
async function processBatch(
  products: IProduct[],
  stats: MigrationStats
): Promise<void> {
  const batches: IProduct[][] = [];
  for (let i = 0; i < products.length; i += CONCURRENT_UPLOADS) {
    batches.push(products.slice(i, i + CONCURRENT_UPLOADS));
  }

  for (const batch of batches) {
    await Promise.all(batch.map((product) => processProduct(product, stats)));
  }
}

/**
 * Main migration function
 */
async function migrateImages() {
  try {
    console.log("Starting image migration to Cloudinary...\n");

    // Validate environment variables
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error(
        "Missing Cloudinary environment variables. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET"
      );
    }

    // Connect to MongoDB
    await connectDB();
    console.log("Connected to MongoDB\n");

    // Find all products that have image URLs
    // We'll filter for non-Cloudinary URLs in JavaScript for better reliability
    const allProducts = await Product.find({
      $or: [
        { previewImage: { $exists: true, $ne: "" } },
        { images: { $exists: true, $type: "array", $ne: [] } },
      ],
    });

    // Filter to only products that have at least one non-Cloudinary image URL
    const products = allProducts.filter((product) => {
      // Check previewImage
      if (
        product.previewImage &&
        product.previewImage.trim() !== "" &&
        !isCloudinaryUrl(product.previewImage)
      ) {
        return true;
      }

      // Check images array
      if (product.images && Array.isArray(product.images)) {
        return product.images.some(
          (url) => url && url.trim() !== "" && !isCloudinaryUrl(url)
        );
      }

      return false;
    });

    console.log(`Found ${products.length} products with external image URLs\n`);

    if (products.length === 0) {
      console.log("No products to migrate. All images are already on Cloudinary.");
      process.exit(0);
    }

    const stats: MigrationStats = {
      totalScanned: products.length,
      totalProcessed: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      failures: [],
    };

    // Process products in batches
    await processBatch(products, stats);

    stats.totalProcessed = stats.successful + stats.failed;

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("MIGRATION SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total products scanned: ${stats.totalScanned}`);
    console.log(`Successfully migrated: ${stats.successful}`);
    console.log(`Failed: ${stats.failed}`);
    console.log(`Skipped (already on Cloudinary): ${stats.skipped}`);

    if (stats.failures.length > 0) {
      console.log("\nFailures:");
      stats.failures.slice(0, 10).forEach((failure) => {
        console.log(`  - Product ID: ${failure.id}`);
        console.log(`    URL: ${failure.url}`);
        console.log(`    Reason: ${failure.reason}`);
      });
      if (stats.failures.length > 10) {
        console.log(`  ... and ${stats.failures.length - 10} more failures`);
      }
    }

    console.log("\nMigration completed!");
    process.exit(0);
  } catch (error) {
    console.error("Fatal error during migration:", error);
    process.exit(1);
  }
}

// Run the migration
migrateImages();

