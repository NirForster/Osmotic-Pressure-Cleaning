import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import productRoutes from "./routes/productRoutes";
import { sitemapController } from "./controllers/sitemapController";

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Middleware
// CORS configuration - allow requests from client URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ben-gigi.com",
  "https://www.ben-gigi.com",
  "https://osmotic-pressure-cleaning-client.onrender.com",
];

// If CLIENT_URL is set, add it to the allowed origins
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Sitemap endpoint (dynamic, includes all products)
app.get("/sitemap.xml", sitemapController.getSitemap);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: "Something went wrong!",
    });
  }
);

// Connect to MongoDB and start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to start server:", errorMessage);
    process.exit(1);
  }
}

startServer();
