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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const sitemapController_1 = require("./controllers/sitemapController");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
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
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Routes
app.use("/api/products", productRoutes_1.default);
// Sitemap endpoint (dynamic, includes all products)
app.get("/sitemap.xml", sitemapController_1.sitemapController.getSitemap);
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: "Something went wrong!",
    });
});
// Connect to MongoDB and start server
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connectDB)();
            app.listen(PORT, "0.0.0.0", () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("Failed to start server:", errorMessage);
            process.exit(1);
        }
    });
}
startServer();
