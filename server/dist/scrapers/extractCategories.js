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
exports.CategoryScraper = void 0;
const playwright_1 = require("playwright");
const scraperUtils_1 = require("./scraperUtils");
class CategoryScraper {
    constructor() {
        this.browser = null;
        this.page = null;
        this.baseUrl = "https://ben-gigi.co.il";
        this.maxRetries = 3;
        this.retryDelay = 5000; // 5 seconds
    }
    init() {
        return __awaiter(this, arguments, void 0, function* (headless = false) {
            scraperUtils_1.ScraperUtils.logSection("Initializing Browser");
            this.browser = yield playwright_1.chromium.launch({
                headless,
                slowMo: headless ? 0 : 1000,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            this.page = yield this.browser.newPage();
            // Set viewport and headers
            yield this.page.setViewportSize({ width: 1280, height: 720 });
            yield this.page.setExtraHTTPHeaders({
                "Accept-Language": "he-IL,he;q=0.9,en;q=0.8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            });
            console.log("✅ Browser initialized successfully");
            console.log(`🔍 Headless mode: ${headless}`);
        });
    }
    waitForPageLoad(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.page)
                throw new Error("Browser not initialized");
            for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
                try {
                    console.log(`Attempt ${attempt}/${this.maxRetries} to load page...`);
                    // Navigate with a more lenient wait condition
                    yield this.page.goto(url, {
                        waitUntil: "domcontentloaded", // Changed from networkidle
                        timeout: 60000, // 60 seconds
                    });
                    // Wait for the menu to be present in the DOM
                    yield this.page.waitForSelector("ul.sf-menu.sf-menu-rtl", {
                        timeout: 30000,
                        state: "attached", // Changed from visible to attached
                    });
                    // Give a small delay for any dynamic content
                    yield this.page.waitForTimeout(2000);
                    console.log("✅ Page loaded successfully");
                    return true;
                }
                catch (error) {
                    console.log(`❌ Attempt ${attempt} failed: ${error instanceof Error ? error.message : "Unknown error"}`);
                    if (attempt < this.maxRetries) {
                        console.log(`Waiting ${this.retryDelay / 1000} seconds before retry...`);
                        yield new Promise((resolve) => setTimeout(resolve, this.retryDelay));
                    }
                }
            }
            return false;
        });
    }
    extractCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.page) {
                throw new Error("Browser not initialized. Call init() first.");
            }
            const startTime = Date.now();
            const url = `${this.baseUrl}/דף-הבית`;
            scraperUtils_1.ScraperUtils.logSection("Extracting Categories");
            console.log(`🌐 Target URL: ${url}`);
            try {
                // Try to load the page with retries
                const pageLoaded = yield this.waitForPageLoad(url);
                if (!pageLoaded) {
                    throw new Error("Failed to load page after multiple attempts");
                }
                // Take initial screenshot
                yield scraperUtils_1.ScraperUtils.takeScreenshot(this.page, "homepage-loaded");
                console.log("✅ Menu found, extracting categories...");
                // Wait for menu to be fully interactive
                yield this.page.waitForTimeout(2000); // Give extra time for any animations
                // Debug: Log the raw HTML of the menu
                const menuHtml = yield this.page.$eval("ul.sf-menu.sf-menu-rtl", (el) => el.innerHTML);
                console.log("🔍 Menu HTML:", menuHtml);
                // Extract all menu items with enhanced selector and debugging
                const menuItems = yield this.page.$$eval("ul.sf-menu.sf-menu-rtl li a", (elements) => {
                    return elements.map((element) => {
                        var _a;
                        // Debug each element
                        console.log("Element:", {
                            href: element.getAttribute("href"),
                            text: element.textContent,
                            id: element.getAttribute("id"),
                            onclick: element.getAttribute("onclick"),
                            class: element.getAttribute("class"),
                        });
                        const href = element.getAttribute("href") || "";
                        const text = ((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "";
                        const id = element.getAttribute("id") || "";
                        return {
                            name: text,
                            url: href,
                            id: id,
                        };
                    });
                });
                // If we didn't get any hrefs, try clicking and getting URLs
                if (menuItems.some((item) => !item.url)) {
                    console.log("⚠️ Some menu items missing URLs, trying click-based approach...");
                    const menuElements = yield this.page.$$("ul.sf-menu.sf-menu-rtl li a");
                    const newMenuItems = [];
                    for (const element of menuElements) {
                        try {
                            // Get the text and id first
                            const text = (yield element.textContent()) || "";
                            const id = (yield element.getAttribute("id")) || "";
                            // Click the element
                            yield element.click();
                            yield this.page.waitForTimeout(1000); // Wait for navigation
                            // Get the current URL
                            const url = this.page.url();
                            // Go back
                            yield this.page.goBack();
                            yield this.page.waitForTimeout(1000); // Wait for navigation
                            newMenuItems.push({
                                name: text.trim(),
                                url: url,
                                id: id,
                            });
                        }
                        catch (error) {
                            console.error("Error processing menu item:", error);
                        }
                    }
                    if (newMenuItems.length > 0) {
                        console.log("✅ Successfully extracted URLs using click-based approach");
                        menuItems.length = 0; // Clear the array
                        menuItems.push(...newMenuItems);
                    }
                }
                console.log(`📋 Found ${menuItems.length} total menu items`);
                // Enhanced filtering for product categories
                const productCategories = menuItems
                    .filter((item) => {
                    const isProductCategory = item.url.includes("/מוצרים/") || this.isProductRelated(item.name);
                    return (isProductCategory &&
                        item.name.length > 0 &&
                        !item.name.includes("דף הבית") &&
                        !item.name.includes("אודות") &&
                        !item.name.includes("צור קשר") &&
                        !item.name.includes("מאמרים"));
                })
                    .map((item) => (Object.assign(Object.assign({}, item), { url: scraperUtils_1.ScraperUtils.normalizeUrl(item.url, this.baseUrl), categoryType: this.categorizeProduct(item.name) })));
                const endTime = Date.now();
                const duration = endTime - startTime;
                scraperUtils_1.ScraperUtils.logSubSection("Extracted Categories");
                productCategories.forEach((category, index) => {
                    console.log(`   ${index + 1}. 📁 ${category.name}`);
                    console.log(`      🔗 ${category.url}`);
                    console.log(`      🏷️  Type: ${category.categoryType}`);
                    console.log(`      🆔 ${category.id}`);
                    console.log("");
                });
                // Save results
                const result = {
                    success: true,
                    data: productCategories,
                    timestamp: new Date(),
                    duration,
                    source: url,
                };
                yield scraperUtils_1.ScraperUtils.saveToFile(result, "categories.json");
                return result;
            }
            catch (error) {
                const endTime = Date.now();
                const duration = endTime - startTime;
                yield scraperUtils_1.ScraperUtils.handleError(error, "Category Extraction");
                return {
                    success: false,
                    data: [],
                    error: error instanceof Error ? error.message : "Unknown error",
                    timestamp: new Date(),
                    duration,
                    source: url,
                };
            }
        });
    }
    isProductRelated(name) {
        const productKeywords = [
            "אביזר",
            "מכונ",
            "שטיפ",
            "ניקוי",
            "מקצועי",
            "שואב",
            "אבק",
            "מחבר",
            "סביבל",
            "R+M",
            "לחץ",
        ];
        return productKeywords.some((keyword) => name.includes(keyword));
    }
    categorizeProduct(name) {
        if (name.includes("אביזר"))
            return "accessories";
        if (name.includes("מכונ"))
            return "machines";
        if (name.includes("מקצועי"))
            return "professional";
        if (name.includes("שואב"))
            return "vacuum";
        if (name.includes("R+M"))
            return "brand";
        if (name.includes("מחבר") || name.includes("סביבל"))
            return "connectors";
        return "other";
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                console.log("🔄 Closing browser...");
                yield this.browser.close();
                console.log("✅ Browser closed");
            }
        });
    }
}
exports.CategoryScraper = CategoryScraper;
// Main execution function
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const scraper = new CategoryScraper();
        try {
            yield scraper.init(false); // Set to true for headless mode
            const result = yield scraper.extractCategories();
            scraperUtils_1.ScraperUtils.logSection("Scraping Summary");
            console.log(`✅ Success: ${result.success}`);
            console.log(`⏱️  Duration: ${(result.duration / 1000).toFixed(2)} seconds`);
            console.log(`📦 Categories found: ${result.data.length}`);
            console.log(`🕐 Timestamp: ${result.timestamp.toISOString()}`);
            if (result.error) {
                console.log(`❌ Error: ${result.error}`);
            }
            return result;
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
