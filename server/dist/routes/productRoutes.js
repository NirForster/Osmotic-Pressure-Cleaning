"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
// Get all products with optional filtering
router.get("/", productController_1.productController.getProducts);
// Get a single product by ID
router.get("/:id", productController_1.productController.getProductById);
// Get all unique categories
router.get("/categories/all", productController_1.productController.getAllCategories);
exports.default = router;
