import { Request, Response } from "express";
import { Product } from "../models/Product";

export const productController = {
  // Get all products with optional filtering
  async getProducts(req: Request, res: Response) {
    try {
      const { category, search, limit = "50", page = "1" } = req.query;
      const query: any = {};

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

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const [products, total] = await Promise.all([
        Product.find(query)
          .skip(skip)
          .limit(parseInt(limit as string))
          .sort({ name: 1 }),
        Product.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: products,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch products",
      });
    }
  },

  // Get a single product by ID
  async getProductById(req: Request, res: Response) {
    try {
      const product = await Product.findOne({ id: req.params.id });
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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch product",
      });
    }
  },

  // Get all unique categories
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await Product.distinct("categoryName");
      res.json({
        success: true,
        data: categories.sort(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch categories",
      });
    }
  },
};
