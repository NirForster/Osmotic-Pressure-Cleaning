import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
} from "@mui/material";
import Loader from "../../components/Loader";
import SEO from "../../components/SEO";
import type { Product } from "../../services/api";
import api from "../../services/api";
import { productCategories } from "../../Router";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getProducts({ limit: 200 });
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError("שגיאה בטעינת המוצרים");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(
      (product) => product.categoryName === selectedCategory
    );
  }, [products, selectedCategory]);

  if (loading) {
    return <Loader />;
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
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
      <SEO
        title="כל המוצרים | Products | בן גיגי | Ben Gigi"
        description="מגוון רחב של ציוד ניקוי מקצועי, מכונות שטיפה בלחץ מים, אביזרים ומוצרי Mosmatic. Browse our full catalog of professional cleaning equipment."
        keywords="בן גיגי, מוצרי נקיון בלחץ מים, כל המוצרים, Mosmatic, Ben Gigi, pressure washing products"
        url="https://ben-gigi.com/products"
      />

      <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
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
          כל המוצרים
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.6,
            fontSize: { xs: "1rem", md: "1.1rem" },
          }}
        >
          {selectedCategory
            ? `${filteredProducts.length} מוצרים בקטגוריה "${selectedCategory}"`
            : "מגוון רחב של ציוד ניקוי מקצועי ואביזרים איכותיים לכל הצרכים שלכם"}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          justifyContent: "center",
          mb: { xs: 3, md: 5 },
        }}
      >
        <Chip
          label="הכל"
          clickable
          color={selectedCategory === null ? "primary" : "default"}
          variant={selectedCategory === null ? "filled" : "outlined"}
          onClick={() => setSelectedCategory(null)}
          sx={{ fontWeight: 600 }}
        />
        {productCategories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            clickable
            color={
              selectedCategory === category.name ? "primary" : "default"
            }
            variant={
              selectedCategory === category.name ? "filled" : "outlined"
            }
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category.name ? null : category.name
              )
            }
            sx={{ fontWeight: 500 }}
          />
        ))}
      </Box>

      {filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            לא נמצאו מוצרים בקטגוריה זו
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
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
                <Chip
                  label={product.categoryName}
                  size="small"
                  sx={{ mb: 1 }}
                />
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
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
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
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ProductsPage;
