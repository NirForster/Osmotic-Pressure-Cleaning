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
  title = "Ben Gigi | High-Pressure Cleaning Devices for Home & Business",
  description = "Ben Gigi supplies high-pressure water cleaning devices for home and professional use. Compare models, view specs and contact us to choose the right pressure washer for your needs.",
  keywords = "pressure washer, high pressure cleaning, water pressure cleaner, power washer Israel, Ben Gigi, cleaning equipment",
  image = "https://ben-gigi.com/images/og-image.jpg",
  url = "https://ben-gigi.com/",
  type = "website",
}: SEOProps) => {
  const fullTitle = title.includes("Ben Gigi")
    ? title
    : `${title} | Ben Gigi`;

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
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(
        `link[rel="${rel}"]`
      ) as HTMLLinkElement;

      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Primary Meta Tags
    setMetaTag("title", fullTitle);
    setMetaTag("description", description);
    setMetaTag("keywords", keywords);
    setLinkTag("canonical", url);

    // Open Graph / Facebook
    setMetaTag("og:type", type, true);
    setMetaTag("og:url", url, true);
    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", image, true);
    setMetaTag("og:site_name", "Ben Gigi", true);

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

