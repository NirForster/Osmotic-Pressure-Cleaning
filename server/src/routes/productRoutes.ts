import express from "express";
import { productController } from "../controllers/productController";

const router = express.Router();

// Get all products with optional filtering
router.get("/", productController.getProducts);

// Get a single product by ID
router.get("/:id", productController.getProductById);

// Get all unique categories
router.get("/categories/all", productController.getAllCategories);

export default router;
