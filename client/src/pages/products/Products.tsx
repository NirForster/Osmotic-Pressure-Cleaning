// pages/ProductsPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { productCategories } from "../Router";

const ProductsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Header Section */}
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
          המוצרים שלנו
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.6,
            fontSize: { xs: "1rem", md: "1.2rem" },
          }}
        >
          מגוון רחב של ציוד ניקוי מקצועי ואביזרים איכותיים לכל הצרכים שלכם
        </Typography>
      </Box>

      {/* Categories Grid */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {productCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card
              sx={{
                height: { xs: 200, md: 240 },
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                background: `linear-gradient(135deg, 
                  ${
                    index % 3 === 0
                      ? "#0ea5e9"
                      : index % 3 === 1
                      ? "#06b6d4"
                      : "#0891b2"
                  } 0%, 
                  ${
                    index % 3 === 0
                      ? "#0284c7"
                      : index % 3 === 1
                      ? "#0891b2"
                      : "#0e7490"
                  } 100%)`,
                color: "white",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 20px 40px rgba(14, 165, 233, 0.3)",
                },
                "&:active": {
                  transform: "translateY(-4px) scale(1.01)",
                },
              }}
              onClick={() => navigate(`/products/${category.path}`)}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.1,
                  backgroundImage:
                    "radial-gradient(circle at 20% 80%, white 2px, transparent 2px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                  p: { xs: 2, md: 3 },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    fontSize: { xs: "3rem", md: "4rem" },
                    mb: { xs: 1, md: 2 },
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                  }}
                >
                  {category.icon}
                </Box>

                {/* Category Name */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.3,
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {category.name}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                    lineHeight: 1.4,
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  {category.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action Section */}
      <Paper
        elevation={0}
        sx={{
          mt: { xs: 4, md: 8 },
          p: { xs: 3, md: 4 },
          textAlign: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderRadius: 3,
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            mb: 2,
          }}
        >
          לא מצאתם מה שחיפשתם?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            maxWidth: 500,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          צרו קשר איתנו ונעזור לכם למצוא בדיוק את הציוד שאתם צריכים
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#475569" }}
            >
              📞 0506362755
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#475569" }}
            >
              ✉️ info@bengigi.co.il
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductsPage;
