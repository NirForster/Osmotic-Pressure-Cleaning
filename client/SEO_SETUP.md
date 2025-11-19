# SEO Setup Documentation

## Overview
This document describes the SEO improvements made to the Ben Gigi website.

## Files Created/Modified

### Created Files:
1. `client/src/components/SEO.tsx` - Reusable SEO component for per-page metadata
2. `client/public/robots.txt` - Search engine crawler instructions
3. `client/public/sitemap.xml` - XML sitemap for search engines
4. `client/SEO_SETUP.md` - This documentation file

### Modified Files:
1. `client/index.html` - Added base SEO meta tags, Open Graph tags, Twitter cards, and JSON-LD structured data
2. `client/src/App.tsx` - Added HelmetProvider wrapper for react-helmet-async
3. `client/src/pages/HomePage.tsx` - Added SEO component
4. `client/src/pages/Articles.tsx` - Added SEO component with page-specific metadata
5. `client/src/pages/CategoryPage.tsx` - Added SEO component with dynamic category metadata
6. `client/src/pages/ProductPage.tsx` - Added SEO component with dynamic product metadata
7. `client/package.json` - Added react-helmet-async dependency

## Open Graph Image

**IMPORTANT:** You need to create and place an Open Graph image at:
- Path: `client/public/images/og-image.jpg`
- Recommended size: 1200x630 pixels
- Format: JPG or PNG
- Content: Should represent your brand/product catalog (e.g., logo, product showcase, or branded image)

The image is referenced in:
- `client/index.html` (meta tags)
- `client/src/components/SEO.tsx` (default image)

Once you add the image, it will be automatically used for social media previews (WhatsApp, Facebook, Twitter, etc.).

## Next Steps

1. **Add the OG Image:**
   - Create a 1200x630px image representing Ben Gigi
   - Save it as `client/public/images/og-image.jpg`
   - The image will be served at `https://ben-gigi.com/images/og-image.jpg`

2. **Submit Sitemap to Google Search Console:**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add your property (https://ben-gigi.com)
   - Navigate to Sitemaps section
   - Submit: `https://ben-gigi.com/sitemap.xml`

3. **Verify in Social Media Debuggers:**
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - Test your URLs to see how they appear when shared

4. **Monitor SEO Performance:**
   - It can take days/weeks for ranking improvements to appear
   - Monitor Google Search Console for indexing status
   - Check for crawl errors and fix them promptly

## Technical Details

### Dependencies Added:
- `react-helmet-async` - For dynamic head tag management (installed with --legacy-peer-deps due to React 19 compatibility)

### SEO Features Implemented:
- ✅ Primary meta tags (title, description, keywords, canonical)
- ✅ Open Graph tags for Facebook/WhatsApp sharing
- ✅ Twitter Card tags
- ✅ JSON-LD structured data (LocalBusiness schema)
- ✅ Per-page dynamic titles and descriptions
- ✅ robots.txt for crawler instructions
- ✅ XML sitemap with all main pages
- ✅ Favicon configuration

### Build & Deploy:
The SEO improvements are automatically included in the build. No additional build steps required.

```bash
npm run build
```

The sitemap and robots.txt will be served from the public folder at:
- `https://ben-gigi.com/robots.txt`
- `https://ben-gigi.com/sitemap.xml`

