import { Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

export interface ScrapingResult<T> {
  success: boolean;
  data: T[];
  error?: string;
  timestamp: Date;
  duration: number;
  source: string;
}

export class ScraperUtils {
  static async ensureDirectory(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
    }
  }

  static async saveToFile<T>(data: T, filename: string, directory: string = './scraped-data'): Promise<void> {
    await this.ensureDirectory(directory);
    const filePath = path.join(directory, filename);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`💾 Data saved to: ${filePath}`);
    } catch (error) {
      console.error(`❌ Failed to save data to ${filePath}:`, error);
      throw error;
    }
  }

  static async loadFromFile<T>(filename: string, directory: string = './scraped-data'): Promise<T | null> {
    const filePath = path.join(directory, filename);
    
    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }
      
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`❌ Failed to load data from ${filePath}:`, error);
      return null;
    }
  }

  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const screenshotsDir = './screenshots';
    await this.ensureDirectory(screenshotsDir);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    const filepath = path.join(screenshotsDir, filename);
    
    await page.screenshot({ 
      path: filepath, 
      fullPage: true 
    });
    
    console.log(`📸 Screenshot saved: ${filepath}`);
  }

  static async waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
    try {
      await page.waitForLoadState('networkidle', { timeout });
      console.log('✅ Page loaded (network idle)');
    } catch (error) {
      console.log('⚠️  Page load timeout, continuing anyway...');
    }
  }

  static logProgress(current: number, total: number, itemName: string = 'items'): void {
    const percentage = ((current / total) * 100).toFixed(1);
    const progress = `[${current}/${total}]`;
    console.log(`📊 Progress ${progress} (${percentage}%) - Processing ${itemName}...`);
  }

  static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static normalizeUrl(url: string, baseUrl: string): string {
    if (this.validateUrl(url)) {
      return url;
    }
    
    // Handle relative URLs
    if (url.startsWith('/')) {
      return new URL(url, baseUrl).toString();
    }
    
    return url;
  }

  static logSection(title: string, width: number = 50): void {
    const border = '='.repeat(width);
    console.log(`\n${border}`);
    console.log(`${title.toUpperCase()}`);
    console.log(border);
  }

  static logSubSection(title: string, width: number = 30): void {
    const border = '-'.repeat(width);
    console.log(`\n${border}`);
    console.log(title);
    console.log(border);
  }

  static async handleError(error: any, context: string): Promise<void> {
    console.error(`\n❌ ERROR in ${context}:`);
    console.error('========================');
    
    if (error.message) {
      console.error(`Message: ${error.message}`);
    }
    
    if (error.stack) {
      console.error(`Stack: ${error.stack}`);
    }
    
    console.error('========================\n');
  }
}