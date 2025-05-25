import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { scrapeProducts } from "./scraper";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Cache for storing scraped products
let productsCache: any[] = [];
let lastScrapeTime: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Endpoint to get all products
app.get("/api/products", async (req, res) => {
  try {
    const currentTime = Date.now();

    // Check if cache is valid
    if (
      productsCache.length > 0 &&
      currentTime - lastScrapeTime < CACHE_DURATION
    ) {
      return res.json(productsCache);
    }

    // Scrape new data if cache is invalid
    const products = await scrapeProducts();
    productsCache = products;
    lastScrapeTime = currentTime;

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Endpoint to force refresh the cache
app.post("/api/products/refresh", async (req, res) => {
  try {
    const products = await scrapeProducts();
    productsCache = products;
    lastScrapeTime = Date.now();
    res.json({ message: "Cache refreshed successfully", products });
  } catch (error) {
    console.error("Error refreshing products:", error);
    res.status(500).json({ error: "Failed to refresh products" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
