"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const database_1 = require("../config/database");
const Product_1 = require("../models/Product");
const BASE_URL = "https://ben-gigi.co.il/";
function importProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield (0, database_1.connectDB)();
            // Read the JSON file
            const jsonPath = path.join(__dirname, "../../scraped-data/all-products.json");
            const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
            if (!jsonData.success || !jsonData.data) {
                throw new Error("Invalid JSON data format");
            }
            // Check for duplicate IDs in the JSON
            const idSet = new Set();
            const duplicateIds = [];
            for (const product of jsonData.data) {
                if (idSet.has(product.id)) {
                    duplicateIds.push(product.id);
                }
                else {
                    idSet.add(product.id);
                }
            }
            if (duplicateIds.length > 0) {
                console.warn(`Duplicate IDs found in JSON:`, duplicateIds);
            }
            // Clear existing products
            yield Product_1.Product.deleteMany({});
            console.log("Cleared existing products");
            // Insert new products with full image URLs
            const products = jsonData.data.map((product) => ({
                name: product.name,
                url: product.url,
                id: product.id,
                sku: product.sku,
                images: (product.images || []).map((img) => img.startsWith("http") ? img : BASE_URL + img),
                previewImage: product.previewImage && !product.previewImage.startsWith("http")
                    ? BASE_URL + product.previewImage
                    : product.previewImage,
                categoryId: product.categoryId,
                categoryName: product.categoryName,
                description: product.description,
                pdfUrl: product.pdfUrl || "",
                videoUrl: product.videoUrl || "",
                subHeader: product.subHeader || "",
                bulletPoints: product.bulletPoints || [],
            }));
            try {
                yield Product_1.Product.insertMany(products, { ordered: false });
                console.log(`Successfully imported ${products.length} products`);
            }
            catch (insertErr) {
                if (insertErr.writeErrors) {
                    console.error(`Insert errors (${insertErr.writeErrors.length}):`);
                    insertErr.writeErrors.forEach((err) => {
                        console.error(`Error for product with id=${err.err.op.id}: ${err.errmsg}`);
                    });
                    const successful = products.length - insertErr.writeErrors.length;
                    console.log(`Successfully imported ${successful} products, ${insertErr.writeErrors.length} failed.`);
                }
                else {
                    console.error("Error inserting products:", insertErr);
                }
            }
            process.exit(0);
        }
        catch (error) {
            console.error("Error importing products:", error);
            process.exit(1);
        }
    });
}
importProducts();
