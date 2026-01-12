import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title = "בן גיגי | Ben Gigi | ציוד ניקוי בלחץ מים | מכונות שטיפה מקצועיות | High-Pressure Cleaning Devices",
  description = "בן גיגי (Ben Gigi) - יבואנית רשמית של מוצרי Mosmatic. מכונות שטיפה בלחץ מים, אביזרים לשטיפת רכב, שואבי אבק מקצועיים וציוד ניקוי תעשייתי. איכות שוויצרית מובילה. High-pressure water cleaning devices for home and professional use.",
  keywords = "בן גיגי, מוצרי נקיון בלחץ מים, שטיפה, מכונת שטיפה, לחץ מים, ניקוי בלחץ, מכונת כביסה בלחץ, Ben Gigi, Mosmatic, ציוד ניקוי מקצועי, אביזרים לשטיפת רכב, pressure washer, high pressure cleaning, water pressure cleaner, power washer Israel, cleaning equipment",
  image = "https://ben-gigi.com/images/og-image.jpg",
  url = "https://ben-gigi.com/",
  type = "website",
}: SEOProps) => {
  // Ensure both Hebrew and English company name appear in title
  const fullTitle = title.includes("Ben Gigi") || title.includes("בן גיגי") 
    ? title 
    : `${title} | בן גיגי | Ben Gigi`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(
        `meta[${attribute}="${name}"]`
      ) as HTMLMetaElement;

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper function to update or create link tag
    const setLinkTag = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
      let element = document.querySelector(selector) as HTMLLinkElement;

      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        if (hreflang) {
          element.setAttribute("hreflang", hreflang);
        }
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Primary Meta Tags
    setMetaTag("title", fullTitle);
    setMetaTag("description", description);
    setMetaTag("keywords", keywords);
    setLinkTag("canonical", url);

    // Hreflang tags for language/region targeting
    setLinkTag("alternate", url, "he-IL");
    setLinkTag("alternate", url, "x-default");

    // Open Graph / Facebook
    setMetaTag("og:type", type, true);
    setMetaTag("og:url", url, true);
    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", image, true);
    setMetaTag("og:site_name", "Ben Gigi", true);
    setMetaTag("og:locale", "he_IL", true);
    setMetaTag("og:locale:alternate", "en_US", true);

    // Twitter
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:url", url);
    setMetaTag("twitter:title", fullTitle);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image);
  }, [fullTitle, description, keywords, image, url, type]);

  // This component doesn't render anything
  return null;
};

export default SEO;
