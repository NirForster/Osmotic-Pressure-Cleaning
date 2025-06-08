import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
} from "@mui/material";
import type { Product } from "../services/api";
import api from "../services/api";
import { productCategories } from "../Router";

const pathToCategoryName = (categoryPath: string | undefined) => {
  const found = productCategories.find((cat) => cat.path === categoryPath);
  return found ? found.name : undefined;
};

const CategoryPage = () => {
  const { categoryPath } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const categoryName = pathToCategoryName(categoryPath);
        console.log(
          "categoryPath:",
          categoryPath,
          "=> categoryName:",
          categoryName
        );
        if (!categoryName) {
          setProducts([]);
          setError("קטגוריה לא נמצאה");
          setLoading(false);
          return;
        }
        const response = await api.getProducts({ category: categoryName });
        console.log("API response:", response.data);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryPath]);

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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          {pathToCategoryName(categoryPath) || "Products"}
        </Typography>
      </Box>

      {/* Products Grid (MUI v6+ syntax) */}
      <Grid container columns={12} columnSpacing={3} rowSpacing={3}>
        {products.map((product) => (
          <Grid
            key={product.id}
            columns={12}
            sx={{
              width: { xs: "100%", sm: "50%", md: "33.33%" },
              display: "flex",
            }}
          >
            <Card
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.previewImage}
                alt={product.name}
                sx={{ objectFit: "contain", p: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                  }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    fontSize: { xs: "0.875rem", md: "1rem" },
                  }}
                >
                  {product.description}
                </Typography>
                {product.sku && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                  >
                    SKU: {product.sku}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryPage;
