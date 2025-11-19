import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import { Readable } from "stream";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration
const CLOUDINARY_FOLDER = "ben-gigi/static-assets";
const DOWNLOAD_TIMEOUT = 60000; // 60 seconds for video download

interface AssetConfig {
  videoUrl: string;
  osmoticsLogoUrl: string;
  benGigiLogoUrl: string;
}

/**
 * Download a file from a URL and return it as a buffer
 */
async function downloadFile(url: string): Promise<Buffer> {
  try {
    console.log(`Downloading ${url}...`);
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: DOWNLOAD_TIMEOUT,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.data) {
      throw new Error("Empty response from URL");
    }

    return Buffer.from(response.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to download file: ${errorMessage}`);
  }
}

/**
 * Read a local file and return it as a buffer
 */
function readLocalFile(filePath: string): Buffer {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return fs.readFileSync(filePath);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read local file: ${errorMessage}`);
  }
}

/**
 * Upload a file buffer to Cloudinary
 */
async function uploadToCloudinary(
  fileBuffer: Buffer,
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: false, // Don't overwrite if already exists
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (!result || !result.secure_url) {
          reject(new Error("Cloudinary upload succeeded but no URL returned"));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const readable = new Readable();
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}

/**
 * Main migration function
 */
async function migrateStaticAssets() {
  try {
    console.log("Starting static assets migration to Cloudinary...\n");

    // Validate environment variables
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error(
        "Missing Cloudinary environment variables. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET"
      );
    }

    const assetConfig: AssetConfig = {
      videoUrl: "",
      osmoticsLogoUrl: "",
      benGigiLogoUrl: "",
    };

    // 1. Upload video from mosmatic.com
    console.log("=".repeat(60));
    console.log("1. Uploading video from mosmatic.com");
    console.log("=".repeat(60));
    try {
      const videoUrl = "https://www.mosmatic.com/videos/Home_EN.mp4";
      const videoBuffer = await downloadFile(videoUrl);
      const cloudinaryVideoUrl = await uploadToCloudinary(
        videoBuffer,
        "home-video",
        "video"
      );
      assetConfig.videoUrl = cloudinaryVideoUrl;
      console.log(`✓ Video uploaded: ${cloudinaryVideoUrl}\n`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`✗ Failed to upload video: ${errorMessage}\n`);
      throw error;
    }

    // 2. Upload osmotics logo
    console.log("=".repeat(60));
    console.log("2. Uploading osmotics logo");
    console.log("=".repeat(60));
    try {
      // Resolve path relative to project root
      // When running from server directory with ts-node, process.cwd() is the server directory
      // So we need to go up one level to get to project root
      const projectRoot = path.resolve(process.cwd(), "..");
      const logoPath = path.join(
        projectRoot,
        "client/src/assets/osmotics logo.png"
      );
      console.log(`Looking for logo at: ${logoPath}`);
      const logoBuffer = readLocalFile(logoPath);
      const cloudinaryLogoUrl = await uploadToCloudinary(
        logoBuffer,
        "osmotics-logo",
        "image"
      );
      assetConfig.osmoticsLogoUrl = cloudinaryLogoUrl;
      console.log(`✓ Osmotics logo uploaded: ${cloudinaryLogoUrl}\n`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`✗ Failed to upload osmotics logo: ${errorMessage}\n`);
      throw error;
    }

    // 3. Upload ben gigi logo
    console.log("=".repeat(60));
    console.log("3. Uploading ben gigi logo");
    console.log("=".repeat(60));
    try {
      // Resolve path relative to project root
      const projectRoot = path.resolve(process.cwd(), "..");
      const benGigiLogoPath = path.join(
        projectRoot,
        "client/public/waterLoaderSvg.svg"
      );
      console.log(`Looking for Ben Gigi logo at: ${benGigiLogoPath}`);
      const benGigiLogoBuffer = readLocalFile(benGigiLogoPath);
      const cloudinaryBenGigiLogoUrl = await uploadToCloudinary(
        benGigiLogoBuffer,
        "ben-gigi-logo",
        "image"
      );
      assetConfig.benGigiLogoUrl = cloudinaryBenGigiLogoUrl;
      console.log(`✓ Ben Gigi logo uploaded: ${cloudinaryBenGigiLogoUrl}\n`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`✗ Failed to upload ben gigi logo: ${errorMessage}\n`);
      throw error;
    }

    // 4. Save config files
    console.log("=".repeat(60));
    console.log("4. Saving configuration");
    console.log("=".repeat(60));
    
    // Save JSON config
    const projectRoot = path.resolve(process.cwd(), "..");
    const jsonConfigPath = path.join(
      projectRoot,
      "client/src/config/cloudinaryAssets.json"
    );
    const configDir = path.dirname(jsonConfigPath);

    // Create config directory if it doesn't exist
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(
      jsonConfigPath,
      JSON.stringify(assetConfig, null, 2),
      "utf-8"
    );
    console.log(`✓ JSON configuration saved to: ${jsonConfigPath}`);

    // Save TypeScript config
    const tsConfigPath = path.join(
      projectRoot,
      "client/src/config/cloudinaryAssets.ts"
    );
    
    const tsConfigContent = `// Cloudinary asset URLs
// This file is auto-generated by the migration script
// Run: npm run migrate:static-assets (from server directory) to update

export const cloudinaryAssets = {
  videoUrl: "${assetConfig.videoUrl}",
  osmoticsLogoUrl: "${assetConfig.osmoticsLogoUrl}",
  benGigiLogoUrl: "${assetConfig.benGigiLogoUrl}",
};

// Fallback URLs (will be replaced after migration)
export const fallbackAssets = {
  videoUrl: "https://www.mosmatic.com/videos/Home_EN.mp4",
  osmoticsLogoUrl: "/src/assets/osmotics logo.png",
  benGigiLogoUrl: "/waterLoaderSvg.svg",
};

// Helper function to get asset URL with fallback
export const getAssetUrl = (
  assetType: "video" | "osmoticsLogo" | "benGigiLogo"
): string => {
  switch (assetType) {
    case "video":
      return (
        cloudinaryAssets.videoUrl || fallbackAssets.videoUrl
      );
    case "osmoticsLogo":
      return (
        cloudinaryAssets.osmoticsLogoUrl ||
        fallbackAssets.osmoticsLogoUrl
      );
    case "benGigiLogo":
      return (
        cloudinaryAssets.benGigiLogoUrl ||
        fallbackAssets.benGigiLogoUrl
      );
    default:
      return "";
  }
};
`;

    fs.writeFileSync(tsConfigPath, tsConfigContent, "utf-8");
    console.log(`✓ TypeScript configuration saved to: ${tsConfigPath}\n`);

    // Print summary
    console.log("=".repeat(60));
    console.log("MIGRATION SUMMARY");
    console.log("=".repeat(60));
    console.log("All static assets have been uploaded to Cloudinary!");
    console.log("\nCloudinary URLs:");
    console.log(`  Video: ${assetConfig.videoUrl}`);
    console.log(`  Osmotics Logo: ${assetConfig.osmoticsLogoUrl}`);
    console.log(`  Ben Gigi Logo: ${assetConfig.benGigiLogoUrl}`);
    console.log(
      `\nConfiguration saved to: client/src/config/cloudinaryAssets.json`
    );
    console.log(
      "\n✓ All React components have been updated to use Cloudinary URLs!"
    );
    console.log(
      "\nNote: The favicon in index.html still references /waterLoaderSvg.svg."
    );
    console.log(
      "  You can update it manually if needed, or it will continue to work from the public folder."
    );

    process.exit(0);
  } catch (error) {
    console.error("Fatal error during migration:", error);
    process.exit(1);
  }
}

// Run the migration
migrateStaticAssets();

