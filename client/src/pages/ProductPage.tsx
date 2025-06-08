import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import api from "../services/api";
import type { Product } from "../services/api";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.getProductById(id!);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
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

  // Prepare images for carousel: use only the images array, deduplicated
  const images = Array.from(new Set(product.images || []));
  console.log(
    "Product images for carousel:",
    images,
    "Original images array:",
    product.images
  );

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Card sx={{ mb: 4 }}>
        <Carousel
          autoPlay
          interval={3500}
          animation="slide"
          navButtonsAlwaysVisible
          indicators={images.length > 1}
        >
          {images.map((img, idx) => (
            <Box
              key={idx}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ height: 350, background: "#f8fafc" }}
            >
              <img
                src={img}
                alt={product.name}
                style={{
                  maxHeight: 320,
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          ))}
        </Carousel>
        <CardContent>
          <Typography variant="h4" fontWeight={700} gutterBottom>
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
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                מאפיינים:
              </Typography>
              <ul>
                {product.bulletPoints.map((point, i) => (
                  <li key={i}>
                    <Typography variant="body2">{point}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
          {product.pdfUrl && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              <a
                href={product.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                לצפייה בקטלוג
              </a>
            </Typography>
          )}
          {product.videoUrl && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              <a
                href={product.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                לצפייה בסרטון
              </a>
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductPage;
