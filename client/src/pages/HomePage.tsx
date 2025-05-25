// pages/HomePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  PlayArrow,
  Phone as PhoneIcon,
} from "@mui/icons-material";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaAction: () => void;
  bgGradient: string;
}

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Carousel slides data
  const slides: CarouselSlide[] = [
    {
      id: 1,
      title: "ציוד ניקוי מקצועי",
      subtitle: "בלחץ מים גבוה",
      description: "מכונות שטיפה איכותיות לכל צורך - מביתי ועד תעשייתי",
      image: "🚿", // Using emoji as placeholder, replace with actual images
      ctaText: "צפה במוצרים",
      ctaAction: () => navigate("/products"),
      bgGradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    },
    {
      id: 2,
      title: "Mosmatic",
      subtitle: "איכות גרמנית מובילה",
      description: "אביזרים ורכיבים מקצועיים למכונות שטיפה בלחץ מים",
      image: "⭐", // Replace with Mosmatic product image
      ctaText: "מוצרי Mosmatic",
      ctaAction: () => navigate("/products/rm-brand"),
      bgGradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    },
    {
      id: 3,
      title: "שואבי אבק מקצועיים",
      subtitle: "לכל סוג פסולת",
      description: "שואבי אבק תעשייתיים לניקוי יעיל ומהיר",
      image: "🌪️", // Replace with vacuum cleaner image
      ctaText: "שואבי אבק",
      ctaAction: () => navigate("/products/vacuum-cleaners"),
      bgGradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      id: 4,
      title: "ייעוץ מקצועי",
      subtitle: "שירות אישי",
      description: "צוות המומחים שלנו כאן לעזור לכם למצוא את הפתרון המושלם",
      image: "📞", // Replace with consultation/service image
      ctaText: "צור קשר",
      ctaAction: () => window.open("tel:+972501234567"),
      bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <Box>
      {/* Hero Carousel */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "70vh", md: "80vh" },
          overflow: "hidden",
          background: slides[currentSlide].bgGradient,
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Slide Content */}
        <Container
          maxWidth="lg"
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 4, md: 8 },
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Text Content */}
            <Fade in={true} timeout={1000} key={`text-${currentSlide}`}>
              <Box
                sx={{
                  color: "white",
                  textAlign: { xs: "center", md: "right" },
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                    lineHeight: 1.1,
                    mb: 2,
                    textShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  {slides[currentSlide].title}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    mb: 3,
                    opacity: 0.9,
                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {slides[currentSlide].subtitle}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    lineHeight: 1.6,
                    mb: 4,
                    opacity: 0.85,
                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {slides[currentSlide].description}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={slides[currentSlide].ctaAction}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: "none",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {slides[currentSlide].ctaText}
                </Button>
              </Box>
            </Fade>

            {/* Image/Icon */}
            <Fade in={true} timeout={1000} key={`image-${currentSlide}`}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: { xs: "8rem", md: "12rem", lg: "15rem" },
                  filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
                  order: { xs: -1, md: 1 },
                }}
              >
                {slides[currentSlide].image}
              </Box>
            </Fade>
          </Box>
        </Container>

        {/* Navigation Arrows */}
        <IconButton
          onClick={prevSlide}
          sx={{
            position: "absolute",
            left: { xs: 16, md: 32 },
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            color: "white",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              transform: "translateY(-50%) scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <ArrowForwardIos />
        </IconButton>

        <IconButton
          onClick={nextSlide}
          sx={{
            position: "absolute",
            right: { xs: 16, md: 32 },
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            color: "white",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              transform: "translateY(-50%) scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <ArrowBackIos />
        </IconButton>

        {/* Slide Indicators */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 24, md: 32 },
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: currentSlide === index ? 24 : 12,
                height: 12,
                borderRadius: 6,
                backgroundColor:
                  currentSlide === index ? "white" : "rgba(255, 255, 255, 0.4)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  transform: "scale(1.2)",
                },
              }}
            />
          ))}

          {/* Auto-play toggle */}
          <IconButton
            onClick={toggleAutoPlay}
            sx={{
              ml: 2,
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              width: 36,
              height: 36,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <PlayArrow
              sx={{
                fontSize: 18,
                opacity: isAutoPlaying ? 1 : 0.5,
              }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* Company Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230ea5e9' fill-opacity='1'%3E%3Cpath d='M50 5L60 35L90 35L68 55L78 85L50 65L22 85L32 55L10 35L40 35Z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "150px 150px",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            {/* Main Headline */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.2rem", md: "3.5rem", lg: "4rem" },
                lineHeight: 1.2,
                color: "#1e293b",
                mb: 2,
                "& strong": {
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 900,
                },
              }}
            >
              אנו מתחייבים לאיכות <strong>Ben Gigi</strong>
            </Typography>

            {/* Decorative Line */}
            <Box
              sx={{
                width: { xs: 100, md: 150 },
                height: 4,
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                borderRadius: 2,
                mx: "auto",
                mb: { xs: 4, md: 6 },
              }}
            />
          </Box>

          {/* Content Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: { xs: 4, md: 6 },
              alignItems: "center",
            }}
          >
            {/* Text Content */}
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 4,
                p: { xs: 4, md: 6 },
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Card Background Pattern */}
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                  opacity: 0.1,
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  lineHeight: 1.8,
                  color: "#374151",
                  fontWeight: 500,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                חברת{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: "#0ea5e9",
                  }}
                >
                  Ben Gigi
                </Box>{" "}
                הנה יבואנית רשמית ובלעדית של חברת{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: "#0ea5e9",
                  }}
                >
                  Mosmatic AG
                </Box>{" "}
                בישראל, החברה מייבאת לארץ מוצרים של ענקית המשאבות האיטלקית{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: "#0ea5e9",
                  }}
                >
                  INTERPUMP
                </Box>
                .
              </Typography>
            </Box>

            {/* Services Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
              }}
            >
              {[
                {
                  icon: "💧",
                  title: "מוצרי ניקיון בלחץ מים",
                  description: "פתרונות ניקוי מתקדמים",
                },
                {
                  icon: "🚗",
                  title: "אביזרים לשטיפת רכב",
                  description: "ציוד מקצועי לשטיפה",
                },
                {
                  icon: "🔧",
                  title: "מכונות שטיפה",
                  description: "לחץ מים חמים או קרים",
                },
                {
                  icon: "🔄",
                  title: "מחברים סיבוביים",
                  description: "רכיבים איכותיים",
                },
              ].map((service, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 3,
                    p: 3,
                    textAlign: "center",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      borderColor: "#0ea5e9",
                    },
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "2.5rem",
                      mb: 2,
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#1e293b",
                      mb: 1,
                      lineHeight: 1.3,
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {service.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Partner Logos Section */}
          <Box
            sx={{
              mt: { xs: 6, md: 8 },
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#475569",
                mb: 4,
                fontSize: { xs: "1.3rem", md: "1.5rem" },
              }}
            >
              שותפים מובילים באיכות
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: { xs: 4, md: 8 },
                flexWrap: "wrap",
              }}
            >
              {/* Mosmatic Logo */}
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: 3,
                  p: { xs: 2, md: 3 },
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#0ea5e9",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <img
                  src="/src/assets/osmotics logo.png"
                  alt="Mosmatic"
                  style={{
                    height: "60px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </Box>

              {/* INTERPUMP Logo Placeholder */}
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: 3,
                  p: { xs: 2, md: 3 },
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#0ea5e9",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    color: "#374151",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                  }}
                >
                  INTERPUMP
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mosmatic Catalog Banner */}
      <Box
        sx={{
          py: 3,
          backgroundColor: "#0ea5e9",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 3 },
              textAlign: { xs: "center", md: "right" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  fontSize: "2rem",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "50%",
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                📖
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    mb: 0.5,
                  }}
                >
                  קטלוג מוצרי Mosmatic המלא
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  עיינו במגוון הרחב של מוצרי Mosmatic באיכות גרמנית
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              href="https://www.mosmatic.com/downloads/catalog/ME25/#page=01"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: "white",
                color: "#0ea5e9",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                "&:hover": {
                  backgroundColor: "#f8fafc",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                },
                transition: "all 0.3s ease",
                minWidth: { xs: "200px", md: "auto" },
              }}
            >
              צפה בקטלוג 🔗
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Quick Contact Section */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          backgroundColor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              backgroundColor: "white",
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#1e293b",
                fontSize: { xs: "1.8rem", md: "2.2rem" },
              }}
            >
              צריכים עזרה בבחירת הציוד?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#64748b",
                mb: 3,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              הצוות המקצועי שלנו כאן לעזור לכם למצוא את הפתרון המושלם
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PhoneIcon />}
              href="tel:+972501234567"
              sx={{
                backgroundColor: "#0ea5e9",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(14, 165, 233, 0.3)",
                "&:hover": {
                  backgroundColor: "#0284c7",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(14, 165, 233, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              חייגו עכשיו: 050-123-4567
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
