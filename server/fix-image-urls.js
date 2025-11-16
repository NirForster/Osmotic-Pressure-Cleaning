const fs = require("fs");
const path = require("path");

const BASE_URL = "https://ben-gigi.co.il/";
const JSON_FILE_PATH = path.join(
  __dirname,
  "scraped-data",
  "all-products.json"
);

// Read the JSON file
const jsonData = JSON.parse(fs.readFileSync(JSON_FILE_PATH, "utf8"));

let updatedCount = 0;

// Update image URLs in each product
jsonData.data.forEach((product) => {
  let updated = false;

  // Update previewImage
  if (product.previewImage && !product.previewImage.startsWith("http")) {
    product.previewImage = BASE_URL + product.previewImage;
    updated = true;
  }

  // Update images array
  if (Array.isArray(product.images)) {
    const newImages = product.images.map((img) =>
      img.startsWith("http") ? img : BASE_URL + img
    );
    if (JSON.stringify(newImages) !== JSON.stringify(product.images)) {
      product.images = newImages;
      updated = true;
    }
  }

  if (updated) {
    updatedCount++;
  }
});

// Write the updated data back to the file
fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(jsonData, null, 2), "utf8");

console.log(`✅ Updated ${updatedCount} products with full image URLs.`);
console.log(`📁 File updated: ${JSON_FILE_PATH}`);
