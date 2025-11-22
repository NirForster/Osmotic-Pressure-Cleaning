import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import productRoutes from "./routes/productRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Middleware
// CORS configuration - allow requests from client URLs
const corsOptions = {
  origin: process.env.CLIENT_URL || [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ben-gigi.com",
    "https://www.ben-gigi.com",
    "https://osmotic-pressure-cleaning-client.onrender.com",
  ], // Allow specific origins
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

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
