"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const Product_1 = require("../models/Product");
exports.productController = {
    // Get all products with optional filtering
    getProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category, search, limit = "50", page = "1" } = req.query;
                const query = {};
                // Add category filter if provided
                if (category) {
                    query.categoryName = category;
                }
                // Add search filter if provided
                if (search) {
                    query.$or = [
                        { name: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } },
                        { sku: { $regex: search, $options: "i" } },
                    ];
                }
                const skip = (parseInt(page) - 1) * parseInt(limit);
                const [products, total] = yield Promise.all([
                    Product_1.Product.find(query)
                        .skip(skip)
                        .limit(parseInt(limit))
                        .sort({ name: 1 }),
                    Product_1.Product.countDocuments(query),
                ]);
                res.json({
                    success: true,
                    data: products,
                    pagination: {
                        total,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        pages: Math.ceil(total / parseInt(limit)),
                    },
                });
            }
            catch (error) {
                console.error("Error fetching products:", error);
                res.status(500).json({
                    success: false,
                    error: "Failed to fetch products",
                });
            }
        });
    },
    // Get a single product by ID
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield Product_1.Product.findOne({ id: req.params.id });
                if (!product) {
                    return res.status(404).json({
                        success: false,
                        error: "Product not found",
                    });
                }
                res.json({
                    success: true,
                    data: product,
                });
            }
            catch (error) {
                console.error("Error fetching product:", error);
                res.status(500).json({
                    success: false,
                    error: "Failed to fetch product",
                });
            }
        });
    },
    // Get all unique categories
    getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield Product_1.Product.distinct("categoryName");
                res.json({
                    success: true,
                    data: categories.sort(),
                });
            }
            catch (error) {
                console.error("Error fetching categories:", error);
                res.status(500).json({
                    success: false,
                    error: "Failed to fetch categories",
                });
            }
        });
    },
};
