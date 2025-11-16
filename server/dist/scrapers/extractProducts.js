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
exports.ProductScraper = void 0;
const playwright_1 = require("playwright");
const scraperUtils_1 = require("./scraperUtils");
class ProductScraper {
    constructor() {
        this.browser = null;
        this.page = null;
    }
    init() {
        return __awaiter(this, arguments, void 0, function* (headless = true) {
            this.browser = yield playwright_1.chromium.launch({ headless });
            this.page = yield this.browser.newPage();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                yield this.browser.close();
            }
        });
    }
    setProgressCallback(callback) {
        this.onProductProgress = callback;
    }
    extractProductDetails(page, productUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield page.goto(productUrl, {
                    waitUntil: "domcontentloaded",
                    timeout: 60000,
                });
                yield page.waitForSelector(".CssCatProductAdjusted_product", {
                    timeout: 10000,
                });
                // Extract product name
                const name = yield page.$eval(".CssCatProductAdjusted_header span", (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; });
                // Extract subheader as the first <p> in span[itemprop='description']
                let subHeader = "";
                try {
                    subHeader = yield page.$eval('span[itemprop="description"] > p:first-of-type', (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; });
                }
                catch (_a) { }
                // Extract description as the rest of the <p>s in span[itemprop='description']
                let description = "";
                try {
                    const ps = yield page.$$eval('span[itemprop="description"] > p:not(:first-of-type)', (els) => els.map((el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; }).filter(Boolean));
                    description = ps.join(" ");
                }
                catch (_b) { }
                // Extract bullet points (if present)
                let bulletPoints = [];
                try {
                    bulletPoints = yield page.$$eval(".CssCatProductAdjusted_product ul li", (els) => els.map((el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; }));
                }
                catch (_c) { }
                // Extract PDF link using provided XPath
                let pdfUrl = "";
                try {
                    const pdfLocator = page.locator("xpath=/html/body/div[1]/div/div/main/div[3]/form/span/div[2]/div[3]/div[1]/span/div/div/div/div/div[2]/a");
                    if ((yield pdfLocator.count()) > 0) {
                        pdfUrl = (yield pdfLocator.first().getAttribute("href")) || "";
                    }
                }
                catch (_d) {
                    try {
                        pdfUrl = yield page.$eval('a:has-text("PDF")', (el) => el.href);
                    }
                    catch (_e) { }
                }
                // Extract video link using provided XPath
                let videoUrl = "";
                try {
                    const videoLocator = page.locator("xpath=/html/body/div[1]/div/div/main/div[3]/form/span/div[2]/div[3]/div[1]/span/div/div/div/div/div[1]/a");
                    if ((yield videoLocator.count()) > 0) {
                        videoUrl = (yield videoLocator.first().getAttribute("href")) || "";
                    }
                }
                catch (_f) {
                    try {
                        videoUrl = yield page.$eval('a:has-text("וידאו")', (el) => el.href);
                    }
                    catch (_g) { }
                }
                // Extract images
                const images = yield page.$$eval(".fotorama__img", (imgs) => imgs.map((img) => img.getAttribute("src") || "").filter(Boolean));
                const previewImage = images.length > 0 ? images[0] : "";
                return {
                    name,
                    subHeader,
                    description,
                    bulletPoints,
                    pdfUrl,
                    videoUrl,
                    images,
                    previewImage,
                };
            }
            catch (error) {
                console.error(`Error extracting product details from ${productUrl}:`, error);
                return {};
            }
        });
    }
    extractProducts(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.page) {
                    throw new Error("Browser not initialized");
                }
                // Navigate to the category page
                console.log(`Navigating to category: ${category.url}`);
                yield this.page.goto(category.url, {
                    waitUntil: "domcontentloaded",
                    timeout: 60000,
                });
                // Wait for initial products to load
                console.log("Waiting for initial products to load...");
                yield this.page.waitForSelector(".CssCatalogAdjusted_product", {
                    timeout: 10000,
                });
                // Scroll to load all products
                console.log("Scrolling to load all products...");
                let previousHeight = 0;
                let currentHeight = yield this.page.evaluate(() => document.body.scrollHeight);
                let scrollAttempts = 0;
                const maxScrollAttempts = 10;
                while (previousHeight !== currentHeight &&
                    scrollAttempts < maxScrollAttempts) {
                    previousHeight = currentHeight;
                    yield this.page.evaluate(() => {
                        window.scrollTo(0, document.body.scrollHeight);
                    });
                    yield new Promise((resolve) => setTimeout(resolve, 2000));
                    currentHeight = yield this.page.evaluate(() => document.body.scrollHeight);
                    scrollAttempts++;
                    const currentProducts = yield this.page.$$(".CssCatalogAdjusted_product");
                    console.log(`Found ${currentProducts.length} products after scroll ${scrollAttempts}`);
                }
                // Collect all product URLs and basic info from the category page
                const productCards = yield this.page.$$(".CssCatalogAdjusted_product");
                console.log(`Found ${productCards.length} products with .CssCatalogAdjusted_product`);
                const productInfos = [];
                for (const [index, card] of productCards.entries()) {
                    try {
                        // Try multiple ways to get the product URL
                        let productUrl = null;
                        try {
                            productUrl = yield card.$eval(".CssCatalogAdjusted_BTNDetails a.details", (el) => el.href);
                        }
                        catch (e) {
                            try {
                                productUrl = yield card.$eval(".CssCatalogAdjusted_top a", (el) => el.href);
                            }
                            catch (e) {
                                try {
                                    productUrl = yield card.$eval("a", (el) => el.href);
                                }
                                catch (e) {
                                    console.error(`Could not find URL for product ${index + 1}`);
                                }
                            }
                        }
                        if (!productUrl) {
                            console.error(`No URL found for product ${index + 1}`);
                            continue;
                        }
                        // Extract basic info from card
                        let name = "";
                        try {
                            name = yield card.$eval(".CssCatalogAdjusted_top a", (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; });
                        }
                        catch (e) {
                            try {
                                name = yield card.$eval("h3 a", (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; });
                            }
                            catch (e) {
                                console.error(`Could not find name for product ${index + 1}`);
                            }
                        }
                        let id = "";
                        try {
                            id = yield card.$eval(".CssCatalogAdjusted_top a", (el) => {
                                var _a;
                                const match = (_a = el.getAttribute("href")) === null || _a === void 0 ? void 0 : _a.match(/prodid=(\d+)/);
                                return match ? match[1] : "";
                            });
                        }
                        catch (_a) { }
                        let sku = "";
                        try {
                            sku = yield card.$eval(".CssCatalogAdjusted_Makat .CAT_Values", (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; });
                        }
                        catch (e) {
                            try {
                                sku = yield card.$eval(".CssCatalogAdjusted_Makat", (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; });
                            }
                            catch (e) {
                                console.error(`Could not find SKU for product ${index + 1}`);
                            }
                        }
                        productInfos.push({ url: productUrl, name, id, sku });
                    }
                    catch (error) {
                        console.error(`Error collecting info for product ${index + 1}:`, error);
                    }
                }
                console.log(`Collected ${productInfos.length} product URLs for category ${category.name}`);
                // Now visit each product page and extract details
                const products = [];
                for (const [index, info] of productInfos.entries()) {
                    try {
                        if (this.onProductProgress) {
                            this.onProductProgress(info.name);
                        }
                        console.log(`\nVisiting product ${index + 1}/${productInfos.length}: ${info.name} (${info.url})`);
                        const details = yield this.extractProductDetails(this.page, info.url);
                        products.push({
                            name: details.name || info.name,
                            url: info.url,
                            id: info.id || info.id,
                            sku: info.sku || info.sku,
                            images: details.images || [],
                            previewImage: details.previewImage ||
                                (details.images && details.images[0]) ||
                                "",
                            categoryId: category.id,
                            categoryName: category.name,
                            description: details.description || "",
                            pdfUrl: details.pdfUrl,
                            videoUrl: details.videoUrl,
                            subHeader: details.subHeader,
                            bulletPoints: details.bulletPoints,
                        });
                        console.log(`Extracted details for: ${info.name}`);
                        yield new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                    catch (error) {
                        console.error(`Error processing product ${index + 1}:`, error);
                        if (error instanceof Error) {
                            console.error(error.stack);
                        }
                    }
                }
                // Save results
                const result = {
                    success: true,
                    data: products,
                    timestamp: new Date(),
                    category: category.name,
                    totalProducts: products.length,
                };
                console.log(`\nSaving results for category ${category.name}`);
                console.log(`Total products found: ${productInfos.length}`);
                console.log(`Successfully processed: ${products.length}`);
                yield scraperUtils_1.ScraperUtils.saveToFile(result, `products-${category.id}.json`);
                return result;
            }
            catch (error) {
                yield scraperUtils_1.ScraperUtils.handleError(error, "Product Scraper");
                return {
                    success: false,
                    error: error instanceof Error ? error.message : "Unknown error",
                    data: [],
                    timestamp: new Date(),
                };
            }
        });
    }
}
exports.ProductScraper = ProductScraper;
// Main execution function
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const scraper = new ProductScraper();
        try {
            yield scraper.init(false); // Set to true for headless mode
            // Example category - you'll want to load this from your categories.json
            const category = {
                name: "מכונות שטיפה בלחץ מים",
                url: "https://ben-gigi.co.il/מוצרים/מכונות-שטיפה-בלחץ-מים",
                id: "LI_A_68311",
            };
            const result = yield scraper.extractProducts(category);
            scraperUtils_1.ScraperUtils.logSection("Scraping Summary");
            console.log(`✅ Success: ${result.success}`);
            console.log(`📦 Products found: ${result.data.length}`);
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
