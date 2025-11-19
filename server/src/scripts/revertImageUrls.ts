import * as dotenv from "dotenv";
import { connectDB } from "../config/database";
import { Product, IProduct } from "../models/Product";

// Load environment variables
dotenv.config();

/**
 * Revert image URLs from Cloudinary back to the original URLs
 * stored in oldPreviewImage and oldImages fields.
 *
 * This script assumes that during migration, the old URLs were stored
 * in oldPreviewImage and oldImages fields. If those fields don't exist,
 * this script will skip those products.
 *
 * Usage:
 *   npm run revert:images
 *
 * Safety:
 *   - This script will only revert products that have oldPreviewImage or oldImages fields
 *   - It will NOT delete the Cloudinary images, just update the MongoDB references
 *   - Run this script only if you need to rollback the migration
 */
async function revertImageUrls() {
  try {
    console.log("Starting image URL reversion...\n");

    // Connect to MongoDB
    await connectDB();
    console.log("Connected to MongoDB\n");

    // Find all products that have old image URLs stored
    const products = await Product.find({
      $or: [
        { oldPreviewImage: { $exists: true, $ne: "" } },
        { oldImages: { $exists: true, $type: "array", $ne: [] } },
      ],
    });

    console.log(
      `Found ${products.length} products with stored old image URLs\n`
    );

    if (products.length === 0) {
      console.log(
        "No products found with old image URLs. Nothing to revert."
      );
      process.exit(0);
    }

    let reverted = 0;
    let skipped = 0;
    const errors: Array<{ id: string; reason: string }> = [];

    for (const product of products) {
      const productId = product.id || String(product._id);
      let needsUpdate = false;

      try {
        const setData: any = {};
        const unsetData: any = {};

        // Revert previewImage if oldPreviewImage exists
        if (product.oldPreviewImage && product.oldPreviewImage.trim() !== "") {
          setData.previewImage = product.oldPreviewImage;
          unsetData.oldPreviewImage = "";
          needsUpdate = true;
          console.log(
            `  Reverting previewImage for product ${productId} to: ${product.oldPreviewImage}`
          );
        }

        // Revert images array if oldImages exists
        if (product.oldImages && Array.isArray(product.oldImages)) {
          setData.images = product.oldImages;
          unsetData.oldImages = "";
          needsUpdate = true;
          console.log(
            `  Reverting images array for product ${productId} (${product.oldImages.length} images)`
          );
        }

        if (needsUpdate) {
          const updateQuery: any = {};
          if (Object.keys(setData).length > 0) {
            updateQuery.$set = setData;
          }
          if (Object.keys(unsetData).length > 0) {
            updateQuery.$unset = unsetData;
          }
          await Product.updateOne({ _id: product._id }, updateQuery);
          reverted++;
          console.log(`✓ Product ${productId} reverted successfully`);
        } else {
          skipped++;
          console.log(`⊘ Product ${productId} - no valid old URLs to revert`);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        errors.push({
          id: productId,
          reason: errorMessage,
        });
        console.error(`✗ Error reverting product ${productId}: ${errorMessage}`);
      }
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("REVERSION SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total products found: ${products.length}`);
    console.log(`Successfully reverted: ${reverted}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log("\nErrors:");
      errors.forEach((error) => {
        console.log(`  - Product ID: ${error.id}`);
        console.log(`    Reason: ${error.reason}`);
      });
    }

    console.log("\nReversion completed!");
    console.log(
      "\nNote: Cloudinary images were NOT deleted. They remain in your Cloudinary account."
    );
    process.exit(0);
  } catch (error) {
    console.error("Fatal error during reversion:", error);
    process.exit(1);
  }
}

// Run the reversion
revertImageUrls();

