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
exports.runCategoryScraper = runCategoryScraper;
const extractCategories_1 = require("./extractCategories");
function runCategoryScraper() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🎬 Starting Ben Gigi Category Scraper");
        console.log("=====================================\n");
        const scraper = new extractCategories_1.CategoryScraper();
        try {
            yield scraper.init(false); // false = visible browser, true = headless
            const startTime = Date.now();
            const result = yield scraper.extractCategories();
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            console.log("\n📈 SCRAPING SUMMARY");
            console.log("==================");
            console.log(`⏱️  Duration: ${duration.toFixed(2)} seconds`);
            console.log(`📦 Categories found: ${result.data.length}`);
            console.log(`🌍 Source URL: https://ben-gigi.co.il/דף-הבית`);
            console.log("\n🗂️  EXTRACTED CATEGORIES");
            console.log("========================");
            result.data.forEach((category, index) => {
                console.log(`\n${index + 1}. 📁 ${category.name}`);
                console.log(`   🔗 ${category.url}`);
                console.log(`   🆔 ${category.id}`);
            });
            // Additional analysis
            console.log("\n🔍 CATEGORY ANALYSIS");
            console.log("====================");
            const categoryTypes = {
                accessories: result.data.filter((c) => c.name.includes("אביזר")),
                machines: result.data.filter((c) => c.name.includes("מכונ")),
                professional: result.data.filter((c) => c.name.includes("מקצועי")),
                vacuum: result.data.filter((c) => c.name.includes("שואב")),
                brands: result.data.filter((c) => c.name.includes("R+M")),
                connectors: result.data.filter((c) => c.name.includes("מחבר") || c.name.includes("סביבל")),
            };
            Object.entries(categoryTypes).forEach(([type, items]) => {
                if (items.length > 0) {
                    console.log(`${type}: ${items.length} categories`);
                }
            });
            return result.data;
        }
        catch (error) {
            console.error("\n💥 SCRAPING FAILED");
            console.error("==================");
            console.error(error);
            return [];
        }
        finally {
            yield scraper.close();
            console.log("\n🏁 Scraper finished");
        }
    });
}
// Run the scraper
if (require.main === module) {
    runCategoryScraper();
}
