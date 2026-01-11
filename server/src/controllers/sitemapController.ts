import { Request, Response } from "express";
import { Product } from "../models/Product";

const BASE_URL = "https://ben-gigi.com";

export const sitemapController = {
  async getSitemap(req: Request, res: Response) {
    try {
      // Fetch all products
      const products = await Product.find({}).select("id").lean();

      // Static pages
      const staticPages = [
        { loc: `${BASE_URL}/`, changefreq: "weekly", priority: "1.0" },
        { loc: `${BASE_URL}/articles`, changefreq: "weekly", priority: "0.8" },
        {
          loc: `${BASE_URL}/products/accessories`,
          changefreq: "weekly",
          priority: "0.9",
        },
        {
          loc: `${BASE_URL}/products/swivel-connectors`,
          changefreq: "weekly",
          priority: "0.9",
        },
        {
          loc: `${BASE_URL}/products/pressure-washers`,
          changefreq: "weekly",
          priority: "0.9",
        },
        {
          loc: `${BASE_URL}/products/professional-equipment`,
          changefreq: "weekly",
          priority: "0.9",
        },
        {
          loc: `${BASE_URL}/products/vacuum-cleaners`,
          changefreq: "weekly",
          priority: "0.9",
        },
        {
          loc: `${BASE_URL}/products/rm-brand`,
          changefreq: "weekly",
          priority: "0.9",
        },
      ];

      // Product pages
      const productPages = products.map((product) => ({
        loc: `${BASE_URL}/product/${product.id}`,
        changefreq: "monthly",
        priority: "0.7",
      }));

      // Combine all URLs
      const allUrls = [...staticPages, ...productPages];

      // Generate XML
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

      res.set("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate sitemap",
      });
    }
  },
};
