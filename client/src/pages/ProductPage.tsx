import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";
import Loader from "../components/Loader";
import ImageCarousel from "../components/ImageCarousel";
import api from "../services/api";
import type { Product } from "../services/api";
import SEO from "../components/SEO";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setFailedImages(new Set()); // Reset failed images when product changes
        const response = await api.getProductById(id!);
        setProduct(response.data);
        setError(null);
      } catch {
        setError("Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography color="error" align="center">
          {error || "Product not found"}
        </Typography>
      </Container>
    );
  }

  // Prepare images for carousel: filter, deduplicate, and validate
  const BASE_URL = "https://ben-gigi.co.il/";

  const prepareImages = () => {
    // Helper function to normalize image URLs (prepend base URL if relative)
    const normalizeImageUrl = (img: string): string => {
      if (!img || typeof img !== "string" || img.trim() === "") {
        return "";
      }
      const trimmed = img.trim();
      // If already a full URL, return as is
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
      }
      // Otherwise, prepend base URL
      return BASE_URL + trimmed;
    };

    // Start with the images array - this is the source of truth
    let filteredImages = (product.images || [])
      .map(normalizeImageUrl)
      .filter((img) => img !== "");

    // Deduplicate using Set to remove exact duplicates
    filteredImages = Array.from(new Set(filteredImages));

    // Only use previewImage as fallback if images array is empty
    if (filteredImages.length === 0 && product.previewImage) {
      const normalizedPreview = normalizeImageUrl(product.previewImage);
      if (normalizedPreview) {
        filteredImages = [normalizedPreview];
      }
    }

    return filteredImages;
  };

  const images = prepareImages();
  const validImages = images.filter((img) => !failedImages.has(img));

  // Debug logging
  console.log("Product images:", {
    original: product.images,
    prepared: images,
    valid: validImages,
    failed: Array.from(failedImages),
  });

  const productTitle = product
    ? `${product.name} | בן גיגי | Ben Gigi`
    : "מוצר | Product | בן גיגי | Ben Gigi";
  const productDescription = product?.description
    ? `${product.description} צפה בפרטי המוצר, מפרטים טכניים ומידע נוסף. View product details, specifications, and contact us for more information.`
    : "צפה בפרטי המוצר, מפרטים טכניים ומידע נוסף. צור קשר לייעוץ מקצועי. View product details, specifications, and contact us for more information.";
  const productKeywords = product
    ? `בן גיגי, מוצרי נקיון בלחץ מים, שטיפה, ${product.name}, ${product.categoryName}, Ben Gigi, pressure washer, cleaning equipment`
    : undefined;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <SEO
        title={productTitle}
        description={productDescription}
        keywords={productKeywords}
        url={`https://ben-gigi.com/product/${id || ""}`}
      />
      <Card sx={{ mb: 4 }}>
        {validImages.length > 0 ? (
          <ImageCarousel
            images={validImages}
            alt={product.name}
            height={350}
            autoPlay={false}
            autoPlayInterval={3500}
            onImageError={(img) => {
              setFailedImages((prev) => new Set(prev).add(img));
            }}
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              height: 350,
              background: "#f8fafc",
              color: "#64748b",
            }}
          >
            <Typography variant="body1">אין תמונות זמינות למוצר זה</Typography>
          </Box>
        )}
        <CardContent>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            {product.name}
          </Typography>
          {product.subHeader && (
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {product.subHeader}
            </Typography>
          )}
          <Typography variant="body1" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          {product.sku && (
            <Typography variant="body2" color="text.secondary">
              SKU: {product.sku}
            </Typography>
          )}
          {product.bulletPoints && product.bulletPoints.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h6"
                component="h2"
                fontWeight={600}
                gutterBottom
              >
                מאפיינים עיקריים:
              </Typography>
              <Box
                component="ul"
                sx={{
                  pl: 2,
                  mb: 0,
                  "& li": {
                    mb: 1,
                  },
                }}
              >
                {product.bulletPoints.map((point, i) => (
                  <li key={i}>
                    <Typography variant="body2" component="span">
                      {point}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Box>
          )}
          {(product.pdfUrl || product.videoUrl) && (
            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #e2e8f0" }}>
              <Typography
                variant="h6"
                component="h2"
                fontWeight={600}
                gutterBottom
                sx={{ mb: 2 }}
              >
                קבצים נוספים:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {product.pdfUrl && (
                  <Typography variant="body2">
                    <a
                      href={product.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#0ea5e9",
                        textDecoration: "none",
                      }}
                    >
                      📄 לצפייה בקטלוג (PDF)
                    </a>
                  </Typography>
                )}
                {product.videoUrl && (
                  <Typography variant="body2">
                    <a
                      href={product.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#0ea5e9",
                        textDecoration: "none",
                      }}
                    >
                      ▶️ לצפייה בסרטון
                    </a>
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductPage;
