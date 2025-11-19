import { Helmet } from "react-helmet-async";

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

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Ben Gigi" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;

