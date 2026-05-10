import * as dotenv from "dotenv";
import * as path from "path";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "../config/database";
import { Product } from "../models/Product";

// Resolve server/.env regardless of shell cwd (avoids silent empty Cloudinary config)
dotenv.config({ path: path.join(__dirname, "../../.env") });

interface CliOptions {
  dryRun: boolean;
}

interface Summary {
  scanned: number;
  alreadyCloudinary: number;
  candidates: number;
  missingAssets: number;
  wouldUpdate: number;
  updated: number;
  failed: number;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const dryRunFlag = args.includes("--dry-run");
  // Safe default: dry-run unless user explicitly passes --apply
  return { dryRun: dryRunFlag || !apply };
}

function isCloudinaryUrl(url: string): boolean {
  return (
    !!url &&
    (url.includes("res.cloudinary.com") || url.includes("cloudinary.com"))
  );
}

function sanitizeForPublicId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function buildPublicId(productId: string, imageIndex?: number): string {
  const base = sanitizeForPublicId(productId);
  const suffix = imageIndex === undefined ? "_preview" : `_img${imageIndex}`;
  return `ben-gigi/products/${base}${suffix}`;
}

function buildCloudinaryUrl(cloudName: string, publicId: string): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

/** Paginated listing stays under Admin API limits vs one api.resource() per image */
async function loadBenGigiProductPublicIds(): Promise<Set<string>> {
  const ids = new Set<string>();
  let next_cursor: string | undefined;
  let pages = 0;

  do {
    const res = (await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      prefix: "ben-gigi/products",
      max_results: 500,
      ...(next_cursor ? { next_cursor } : {}),
    })) as {
      resources?: Array<{ public_id?: string }>;
      next_cursor?: string;
    };

    pages++;
    for (const r of res.resources ?? []) {
      if (r.public_id) ids.add(r.public_id);
    }
    next_cursor = res.next_cursor;
  } while (next_cursor);

  console.log(
    `Cloudinary index: ${ids.size} public_id(s) loaded via ${pages} list API request(s)`
  );
  return ids;
}

async function main() {
  const { dryRun } = parseArgs();
  const summary: Summary = {
    scanned: 0,
    alreadyCloudinary: 0,
    candidates: 0,
    missingAssets: 0,
    wouldUpdate: 0,
    updated: 0,
    failed: 0,
  };

  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error(
        "Missing Cloudinary env vars. Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
      );
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    await connectDB();

    const products = await Product.find({
      $or: [
        { previewImage: { $exists: true, $ne: "" } },
        { images: { $exists: true, $type: "array", $ne: [] } },
      ],
    });

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    console.log(`Mode: ${dryRun ? "dry-run" : "apply"}`);
    console.log(`Products loaded: ${products.length}`);

    const cloudinaryPublicIds = await loadBenGigiProductPublicIds();

    for (const product of products) {
      summary.scanned++;
      try {
        const productId = product.id || String(product._id);
        const setData: Record<string, unknown> = {};
        let productHasChange = false;

        // previewImage
        if (product.previewImage) {
          if (isCloudinaryUrl(product.previewImage)) {
            summary.alreadyCloudinary++;
          } else {
            summary.candidates++;
            const previewPublicId = buildPublicId(productId);
            const previewExists = cloudinaryPublicIds.has(previewPublicId);
            if (previewExists) {
              setData.previewImage = buildCloudinaryUrl(
                cloudName,
                previewPublicId
              );
              productHasChange = true;
            } else {
              summary.missingAssets++;
            }
          }
        }

        // images[]
        if (Array.isArray(product.images) && product.images.length > 0) {
          const nextImages = [...product.images];
          let imagesChanged = false;

          for (let i = 0; i < product.images.length; i++) {
            const current = product.images[i];
            if (!current) continue;
            if (isCloudinaryUrl(current)) {
              summary.alreadyCloudinary++;
              continue;
            }

            summary.candidates++;
            const imgPublicId = buildPublicId(productId, i);
            const exists = cloudinaryPublicIds.has(imgPublicId);
            if (exists) {
              nextImages[i] = buildCloudinaryUrl(cloudName, imgPublicId);
              imagesChanged = true;
            } else {
              summary.missingAssets++;
            }
          }

          if (imagesChanged) {
            setData.images = nextImages;
            productHasChange = true;
          }
        }

        if (productHasChange) {
          summary.wouldUpdate++;
          if (!dryRun) {
            await Product.updateOne({ _id: product._id }, { $set: setData });
            summary.updated++;
          }
        }
      } catch (err) {
        summary.failed++;
        console.error(
          `Failed product ${product.id || String(product._id)}:`,
          err instanceof Error ? err.message : String(err)
        );
      }
    }

    console.log("\nRecovery summary");
    console.log("================");
    console.log(`scanned: ${summary.scanned}`);
    console.log(`alreadyCloudinary: ${summary.alreadyCloudinary}`);
    console.log(`candidatesChecked: ${summary.candidates}`);
    console.log(`missingAssets: ${summary.missingAssets}`);
    console.log(`wouldUpdate: ${summary.wouldUpdate}`);
    console.log(`updated: ${summary.updated}`);
    console.log(`failed: ${summary.failed}`);
    if (dryRun) {
      console.log("\nDry-run only: no database changes were made.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Recovery script failed:", error);
    process.exit(1);
  }
}

main();
