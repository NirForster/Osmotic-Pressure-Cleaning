# Image Migration to Cloudinary

This document explains how to migrate product images from external URLs to Cloudinary.

## Prerequisites

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

   The following packages are required (already added to `package.json`):
   - `cloudinary` - Official Cloudinary Node.js SDK
   - `axios` - For downloading images from external URLs
   - `dotenv` - For loading environment variables (already installed)

2. **Set up Cloudinary account:**
   - Sign up at https://cloudinary.com (free tier available)
   - Get your Cloudinary credentials from the dashboard

3. **Configure environment variables:**
   
   Add the following to your `.env` file in the `server/` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Usage

### Running the Migration

From the `server/` directory, run:

```bash
npm run migrate:images
```

Or directly with ts-node:

```bash
npx ts-node src/scripts/migrateImagesToCloudinary.ts
```

### What the Script Does

1. **Connects to MongoDB** using your existing connection setup
2. **Finds all products** with image URLs that don't point to Cloudinary
3. **Processes images in batches** (5 concurrent uploads at a time) to avoid rate limiting
4. **For each product:**
   - Downloads images from external URLs
   - Uploads them to Cloudinary under the folder `ben-gigi/products`
   - Updates the MongoDB document with the new Cloudinary URLs
   - Stores the original URLs in `oldPreviewImage` and `oldImages` fields for potential rollback

5. **Provides a summary** at the end with:
   - Total products scanned
   - Successfully migrated count
   - Failed migrations (with reasons)
   - Skipped (already on Cloudinary)

### Idempotency

The script is **safe to run multiple times**:
- It automatically skips images that already point to Cloudinary
- If it crashes halfway, you can simply run it again
- It will only process images that haven't been migrated yet

### Reverting the Migration

If you need to rollback the migration and restore original URLs:

```bash
npm run revert:images
```

This script:
- Finds all products with `oldPreviewImage` or `oldImages` fields
- Restores the original URLs
- Removes the `oldPreviewImage` and `oldImages` fields

**Note:** This does NOT delete images from Cloudinary. They remain in your Cloudinary account.

## Image Fields Migrated

The script migrates the following fields from the Product model:
- `previewImage` (string) - Single preview image URL
- `images` (string[]) - Array of product image URLs

## Cloudinary Configuration

Images are uploaded with:
- **Folder:** `ben-gigi/products`
- **Public ID format:** `{productId}_preview` or `{productId}_img{index}`
- **Resource type:** Image
- **Overwrite:** Disabled (won't overwrite existing images)

## Troubleshooting

### Common Issues

1. **"Missing Cloudinary environment variables"**
   - Ensure all three Cloudinary env vars are set in your `.env` file

2. **"Failed to download image"**
   - The external URL might be down or blocking requests
   - Check the error message for the specific URL
   - The script will continue with other images

3. **"Cloudinary upload failed"**
   - Check your Cloudinary API credentials
   - Verify your Cloudinary account is active
   - Check Cloudinary dashboard for rate limits

4. **Rate limiting**
   - The script processes 5 images concurrently by default
   - If you hit rate limits, you can reduce `CONCURRENT_UPLOADS` in the script

### Viewing Logs

The script provides detailed logging:
- `✓` - Successfully migrated
- `✗` - Failed migration
- `⊘` - Skipped (already on Cloudinary)

## Example Output

```
Starting image migration to Cloudinary...

Connected to MongoDB

Found 150 products with external image URLs

  Processing previewImage for product prod-123: https://example.com/image.jpg
  ✓ Preview image migrated: https://res.cloudinary.com/...
  Processing images[0] for product prod-123: https://example.com/img1.jpg
  ✓ Image 0 migrated: https://res.cloudinary.com/...
✓ Product prod-123 updated successfully

============================================================
MIGRATION SUMMARY
============================================================
Total products scanned: 150
Successfully migrated: 145
Failed: 3
Skipped (already on Cloudinary): 2
```

