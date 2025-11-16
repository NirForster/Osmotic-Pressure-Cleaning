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
const extractProducts_1 = require("./extractProducts");
const scraperUtils_1 = require("./scraperUtils");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function loadCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categoriesPath = path.join(process.cwd(), "scraped-data", "categories.json");
            const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));
            return categoriesData.data;
        }
        catch (error) {
            console.error("Error loading categories:", error);
            return [];
        }
    });
}
function formatDuration(startTime) {
    const duration = Date.now() - startTime.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
}
function updateProgress(stats) {
    const progress = {
        categories: `${stats.processedCategories}/${stats.totalCategories}`,
        products: `${stats.processedProducts}/${stats.totalProducts}`,
        success: stats.successfulProducts,
        failed: stats.failedProducts,
        duration: formatDuration(stats.startTime),
        current: stats.currentCategory ? `Category: ${stats.currentCategory}` : "",
        currentProduct: stats.currentProduct
            ? `Product: ${stats.currentProduct}`
            : "",
    };
    // Clear previous progress
    process.stdout.write("\x1Bc");
    console.log("\n🔄 Scraping Progress");
    console.log("==================");
    console.log(`📚 Categories: ${progress.categories} (${((stats.processedCategories / stats.totalCategories) *
        100).toFixed(1)}%)`);
    console.log(`📦 Products: ${progress.products} (${((stats.processedProducts / stats.totalProducts) *
        100).toFixed(1)}%)`);
    console.log(`✅ Successful: ${progress.success}`);
    console.log(`❌ Failed: ${progress.failed}`);
    console.log(`⏱️  Duration: ${progress.duration}`);
    console.log(`\n📍 Current: ${progress.current}`);
    if (progress.currentProduct) {
        console.log(`   ${progress.currentProduct}`);
    }
    console.log("\n");
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const scraper = new extractProducts_1.ProductScraper();
        const allProducts = [];
        const stats = {
            totalCategories: 0,
            processedCategories: 0,
            totalProducts: 0,
            processedProducts: 0,
            successfulProducts: 0,
            failedProducts: 0,
            startTime: new Date(),
        };
        try {
            // Load categories from the saved JSON file
            const categories = yield loadCategories();
            stats.totalCategories = categories.length;
            console.log(`📚 Loaded ${categories.length} categories to process`);
            // Initialize the browser
            yield scraper.init(false); // Set to true for headless mode
            // Set up progress callback
            scraper.setProgressCallback((productName) => {
                stats.currentProduct = productName;
                updateProgress(stats);
            });
            // Process each category
            for (const [index, category] of categories.entries()) {
                stats.currentCategory = category.name;
                updateProgress(stats);
                try {
                    const result = yield scraper.extractProducts(category);
                    stats.processedCategories++;
                    if (result.success) {
                        stats.successfulProducts += result.data.length;
                        allProducts.push(...result.data);
                    }
                    else {
                        stats.failedProducts += result.totalProducts || 0;
                    }
                    stats.processedProducts += result.totalProducts || 0;
                    updateProgress(stats);
                    // Add a small delay between categories to be nice to the server
                    yield new Promise((resolve) => setTimeout(resolve, 2000));
                }
                catch (error) {
                    console.error(`❌ Error processing category ${category.name}:`, error);
                    stats.failedProducts++;
                    stats.processedCategories++;
                    updateProgress(stats);
                }
            }
            // Save all products to a single file
            const finalResult = {
                success: true,
                data: allProducts,
                timestamp: new Date(),
                totalProducts: allProducts.length,
                totalCategories: categories.length,
                stats: {
                    successfulProducts: stats.successfulProducts,
                    failedProducts: stats.failedProducts,
                    duration: formatDuration(stats.startTime),
                },
            };
            yield scraperUtils_1.ScraperUtils.saveToFile(finalResult, "all-products.json");
            // Print final summary
            scraperUtils_1.ScraperUtils.logSection("Final Summary");
            console.log(`✅ Total categories processed: ${categories.length}`);
            console.log(`📦 Total products scraped: ${allProducts.length}`);
            console.log(`✅ Successful products: ${stats.successfulProducts}`);
            console.log(`❌ Failed products: ${stats.failedProducts}`);
            console.log(`⏱️  Total duration: ${formatDuration(stats.startTime)}`);
            console.log(`🕐 Timestamp: ${finalResult.timestamp.toISOString()}`);
            console.log(`💾 All products saved to: all-products.json`);
        }
        catch (error) {
            yield scraperUtils_1.ScraperUtils.handleError(error, "Main Execution");
        }
        finally {
            yield scraper.close();
        }
    });
}
// Run if this file is executed directly
if (require.main === module) {
    main();
}
