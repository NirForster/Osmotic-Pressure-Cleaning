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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = require("../models/Product");
const BASE_URL = "https://ben-gigi.co.il/";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/osmotic-pressure";
function updateImageUrls() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(MONGODB_URI);
        const products = yield Product_1.Product.find({});
        let updatedCount = 0;
        for (const product of products) {
            let updated = false;
            if (product.previewImage && !product.previewImage.startsWith("http")) {
                product.previewImage = BASE_URL + product.previewImage;
                updated = true;
            }
            if (Array.isArray(product.images)) {
                const newImages = product.images.map((img) => img.startsWith("http") ? img : BASE_URL + img);
                if (JSON.stringify(newImages) !== JSON.stringify(product.images)) {
                    product.images = newImages;
                    updated = true;
                }
            }
            if (updated) {
                yield product.save();
                updatedCount++;
            }
        }
        console.log(`Updated ${updatedCount} products with full image URLs.`);
        process.exit(0);
    });
}
updateImageUrls().catch((err) => {
    console.error("Error updating image URLs:", err);
    process.exit(1);
});
