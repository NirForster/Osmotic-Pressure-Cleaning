import { connectDB } from "../config/database";
import { Product } from "../models/Product";

const OLD_NAMES = ["מחבר סיבובי - סביבל", "מחבר סיבובי סביבל"];
const NEW_NAME = "מחבר סיבובי";

async function fixSwivelCategoryName() {
  await connectDB();

  const result = await Product.updateMany(
    { categoryName: { $in: OLD_NAMES } },
    { $set: { categoryName: NEW_NAME } }
  );

  console.log(`Updated ${result.modifiedCount} products to "${NEW_NAME}"`);
  process.exit(0);
}

fixSwivelCategoryName().catch((error) => {
  console.error("Failed to update category names:", error);
  process.exit(1);
});
