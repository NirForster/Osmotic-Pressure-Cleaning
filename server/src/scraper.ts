import puppeteer from "puppeteer";

interface Product {
  name: string;
  description: string;
  imageUrl: string;
  link: string;
}

export async function scrapeProducts(): Promise<Product[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://ben-gigi.co.il/", {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for the products to load
    await page.waitForSelector(".product-item", { timeout: 5000 }).catch(() => {
      console.log("No product items found, might need to adjust selectors");
    });

    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".product-item");
      return Array.from(productElements).map((element) => {
        const nameElement = element.querySelector(".product-name");
        const descriptionElement = element.querySelector(
          ".product-description"
        );
        const imageElement = element.querySelector("img");
        const linkElement = element.querySelector("a");

        return {
          name: nameElement?.textContent?.trim() || "",
          description: descriptionElement?.textContent?.trim() || "",
          imageUrl: imageElement?.getAttribute("src") || "",
          link: linkElement?.getAttribute("href") || "",
        };
      });
    });

    return products;
  } catch (error) {
    console.error("Error during scraping:", error);
    throw error;
  } finally {
    await browser.close();
  }
}
