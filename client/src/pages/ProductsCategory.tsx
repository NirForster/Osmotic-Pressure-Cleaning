// pages/ProductCategory.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  Skeleton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

// Type definitions
interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: number;
  brand?: string;
  category: string;
  specifications?: Record<string, string>;
}

interface ProductCategoryProps {
  category: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
}

// Mock data - replace with actual API call
const generateMockProducts = (categoryId: string): Product[] => {
  const products: Product[] = [];
  for (let i = 1; i <= 12; i++) {
    products.push({
      id: `${categoryId}-${i}`,
      name: `מוצר ${i} - ${categoryId}`,
      description: `תיאור מפורט של מוצר ${i} בקטגוריה זו. מוצר איכותי ומקצועי.`,
      image: `/images/products/${categoryId}/${i}.jpg`,
      price: Math.floor(Math.random() * 1000) + 100,
      brand: ["Karcher", "Bosch", "Nilfisk", "R+M"][
        Math.floor(Math.random() * 4)
      ],
      category: categoryId,
      specifications: {
        "לחץ מקסימלי": `${Math.floor(Math.random() * 200) + 100} בר`,
        "צריכת מים": `${Math.floor(Math.random() * 10) + 5} ליטר/דקה`,
        משקל: `${Math.floor(Math.random() * 20) + 5} ק"ג`,
      },
    });
  }
  return products;
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <Card
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: 2,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      },
    }}
  >
    <Box sx={{ position: "relative" }}>
      <CardMedia
        component="div"
        sx={{
          height: 200,
          backgroundColor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3rem",
        }}
      >
        💧
      </CardMedia>
      {product.brand && (
        <Chip
          label={product.brand}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        />
      )}
    </Box>

    <CardContent sx={{ flexGrow: 1, p: 2 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          fontSize: "1.1rem",
          lineHeight: 1.3,
          color: "#1e293b",
        }}
      >
        {product.name}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, lineHeight: 1.5 }}
      >
        {product.description}
      </Typography>

      {product.specifications && (
        <Box sx={{ mb: 2 }}>
          {Object.entries(product.specifications)
            .slice(0, 2)
            .map(([key, value]) => (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {key}:
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {value}
                </Typography>
              </Box>
            ))}
        </Box>
      )}

      {product.price && (
        <Typography
          variant="h6"
          sx={{
            color: "#0ea5e9",
            fontWeight: 700,
            fontSize: "1.2rem",
          }}
        >
          ₪{product.price.toLocaleString()}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const ProductCategory: React.FC<ProductCategoryProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      const mockProducts = generateMockProducts(category.id);
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [category.id]);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand &&
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, products]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Category Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Box sx={{ fontSize: "3rem", mb: 2 }}>{category.icon}</Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            fontSize: { xs: "1.8rem", md: "2.5rem" },
          }}
        >
          {category.name}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
        >
          {category.description}
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="חיפוש מוצרים..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#64748b" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 500,
            mx: "auto",
            display: "block",
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "white",
            },
          }}
        />
      </Box>

      {/* Products Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 9 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: 350 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={28} width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          )}

          {/* No Results */}
          {filteredProducts.length === 0 && !loading && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                לא נמצאו מוצרים התואמים לחיפוש
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductCategory;
