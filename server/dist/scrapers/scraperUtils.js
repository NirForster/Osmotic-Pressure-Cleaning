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
exports.ScraperUtils = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ScraperUtils {
    static ensureDirectory(dirPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`📁 Created directory: ${dirPath}`);
            }
        });
    }
    static saveToFile(data_1, filename_1) {
        return __awaiter(this, arguments, void 0, function* (data, filename, directory = './scraped-data') {
            yield this.ensureDirectory(directory);
            const filePath = path.join(directory, filename);
            try {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                console.log(`💾 Data saved to: ${filePath}`);
            }
            catch (error) {
                console.error(`❌ Failed to save data to ${filePath}:`, error);
                throw error;
            }
        });
    }
    static loadFromFile(filename_1) {
        return __awaiter(this, arguments, void 0, function* (filename, directory = './scraped-data') {
            const filePath = path.join(directory, filename);
            try {
                if (!fs.existsSync(filePath)) {
                    return null;
                }
                const data = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(data);
            }
            catch (error) {
                console.error(`❌ Failed to load data from ${filePath}:`, error);
                return null;
            }
        });
    }
    static takeScreenshot(page, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const screenshotsDir = './screenshots';
            yield this.ensureDirectory(screenshotsDir);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${name}-${timestamp}.png`;
            const filepath = path.join(screenshotsDir, filename);
            yield page.screenshot({
                path: filepath,
                fullPage: true
            });
            console.log(`📸 Screenshot saved: ${filepath}`);
        });
    }
    static waitForPageLoad(page_1) {
        return __awaiter(this, arguments, void 0, function* (page, timeout = 30000) {
            try {
                yield page.waitForLoadState('networkidle', { timeout });
                console.log('✅ Page loaded (network idle)');
            }
            catch (error) {
                console.log('⚠️  Page load timeout, continuing anyway...');
            }
        });
    }
    static logProgress(current, total, itemName = 'items') {
        const percentage = ((current / total) * 100).toFixed(1);
        const progress = `[${current}/${total}]`;
        console.log(`📊 Progress ${progress} (${percentage}%) - Processing ${itemName}...`);
    }
    static delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
    static sanitizeFilename(filename) {
        return filename
            .replace(/[<>:"/\\|?*]/g, '-')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    static validateUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    static normalizeUrl(url, baseUrl) {
        if (this.validateUrl(url)) {
            return url;
        }
        // Handle relative URLs
        if (url.startsWith('/')) {
            return new URL(url, baseUrl).toString();
        }
        return url;
    }
    static logSection(title, width = 50) {
        const border = '='.repeat(width);
        console.log(`\n${border}`);
        console.log(`${title.toUpperCase()}`);
        console.log(border);
    }
    static logSubSection(title, width = 30) {
        const border = '-'.repeat(width);
        console.log(`\n${border}`);
        console.log(title);
        console.log(border);
    }
    static handleError(error, context) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error(`\n❌ ERROR in ${context}:`);
            console.error('========================');
            if (error.message) {
                console.error(`Message: ${error.message}`);
            }
            if (error.stack) {
                console.error(`Stack: ${error.stack}`);
            }
            console.error('========================\n');
        });
    }
}
exports.ScraperUtils = ScraperUtils;
