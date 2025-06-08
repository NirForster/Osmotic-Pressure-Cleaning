import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Product } from "../models/Product";

const BASE_URL = "https://ben-gigi.co.il/";
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/osmotic-pressure";

async function updateImageUrls() {
  await mongoose.connect(MONGODB_URI);
  const products = await Product.find({});
  let updatedCount = 0;

  for (const product of products) {
    let updated = false;
    if (product.previewImage && !product.previewImage.startsWith("http")) {
      product.previewImage = BASE_URL + product.previewImage;
      updated = true;
    }
    if (Array.isArray(product.images)) {
      const newImages = product.images.map((img: string) =>
        img.startsWith("http") ? img : BASE_URL + img
      );
      if (JSON.stringify(newImages) !== JSON.stringify(product.images)) {
        product.images = newImages;
        updated = true;
      }
    }
    if (updated) {
      await product.save();
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} products with full image URLs.`);
  process.exit(0);
}

updateImageUrls().catch((err) => {
  console.error("Error updating image URLs:", err);
  process.exit(1);
});
