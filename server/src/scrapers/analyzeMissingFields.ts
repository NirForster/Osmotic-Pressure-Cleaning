import * as fs from "fs";
import * as path from "path";

interface Product {
  name: string;
  url: string;
  id: string;
  sku: string;
  images: string[];
  previewImage: string;
  categoryId: string;
  categoryName: string;
  description: string;
  pdfUrl?: string;
  videoUrl?: string;
  subHeader?: string;
  bulletPoints?: string[];
}

function isMissing(value: any) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function tryFixJsonSyntax(filePath: string, outputPath: string) {
  let raw = fs.readFileSync(filePath, "utf-8");
  // Try to fix common trailing comma issues
  raw = raw.replace(/,\s*([}\]])/g, "$1");
  // Remove BOM if present
  if (raw.charCodeAt(0) === 0xfeff) {
    raw = raw.slice(1);
  }
  try {
    const parsed = JSON.parse(raw);
    fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2), "utf-8");
    console.log(`Fixed JSON written to: ${outputPath}`);
    return parsed;
  } catch (e) {
    console.error("Could not fix JSON syntax automatically.");
    throw e;
  }
}

function analyzeMissingFieldsNoBullets() {
  const filePath = path.join(
    process.cwd(),
    "scraped-data",
    "all-products.json"
  );
  const fixedPath = path.join(
    process.cwd(),
    "scraped-data",
    "all-products-fixed.json"
  );
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    console.warn("JSON syntax error detected, attempting to fix...");
    data = tryFixJsonSyntax(filePath, fixedPath);
  }
  const products: Product[] = data.data || [];

  const requiredFields: (keyof Product)[] = [
    "name",
    "url",
    "id",
    "sku",
    "images",
    "previewImage",
    "categoryId",
    "categoryName",
    "description",
    "pdfUrl",
    "videoUrl",
    "subHeader",
    // 'bulletPoints' intentionally omitted
  ];

  let missingCount = 0;
  const rows: string[] = ["name,category,missing_fields"];

  for (const product of products) {
    const missing: string[] = [];
    for (const field of requiredFields) {
      if (isMissing(product[field])) {
        missing.push(field);
      }
    }
    if (missing.length > 0) {
      missingCount++;
      rows.push(
        `"${product.name.replace(/"/g, '""')}","${product.categoryName.replace(
          /"/g,
          '""'
        )}","${missing.join("; ")}"`
      );
    }
  }

  const csvPath = path.join(
    process.cwd(),
    "scraped-data",
    "missing-fields-no-bullets.csv"
  );
  fs.writeFileSync(csvPath, rows.join("\n"), "utf-8");

  if (missingCount === 0) {
    console.log(
      "All products have all fields filled (excluding bulletPoints)."
    );
  } else {
    console.log(
      `\nTotal products with missing fields (excluding bulletPoints): ${missingCount}`
    );
    console.log(`CSV report written to: ${csvPath}`);
  }
}

analyzeMissingFieldsNoBullets();
