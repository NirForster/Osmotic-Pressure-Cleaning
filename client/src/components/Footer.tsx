// components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Box, Container, Typography, IconButton, Divider } from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Home as HomeIcon,
  Inventory as ProductsIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import { productCategories } from "../Router";

const Footer = () => {
  const quickLinks = [
    { path: "/", name: "בית", icon: <HomeIcon /> },
    { path: "/products", name: "מוצרים", icon: <ProductsIcon /> },
    { path: "/articles", name: "מאמרים", icon: <ArticleIcon /> },
  ];

  const contactInfo = [
    {
      icon: <PhoneIcon />,
      text: "050-123-4567",
      href: "tel:+972501234567",
    },
    {
      icon: <EmailIcon />,
      text: "info@bengigi.co.il",
      href: "mailto:info@bengigi.co.il",
    },
    {
      icon: <LocationIcon />,
      text: "תל אביב, ישראל",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: <WhatsAppIcon />,
      href: "https://wa.me/972501234567",
      color: "#25D366",
    },
    {
      icon: <FacebookIcon />,
      href: "https://facebook.com",
      color: "#1877F2",
    },
    {
      icon: <InstagramIcon />,
      href: "https://instagram.com",
      color: "#E4405F",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        color: "white",
        mt: "auto",
        position: "relative",
        overflow: "hidden",
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
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Main Footer Content */}
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: { xs: 3, md: 4 },
            }}
          >
            {/* Company Info */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                {/* Ben Gigi Logo */}
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <img
                    src="/waterLoaderSvg.svg"
                    alt="Ben Gigi Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* Company Name */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    background:
                      "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Ben Gigi
                </Typography>

                {/* Mosmatic Logo */}
                <Box
                  sx={{
                    height: 36,
                    width: "auto",
                    ml: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/src/assets/osmotics logo.png"
                    alt="Mosmatic"
                    style={{
                      height: "100%",
                      width: "auto",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)", // Makes the logo white for dark background
                    }}
                  />
                </Box>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                מובילים בתחום ציוד ניקוי בלחץ מים. איכות, מקצועיות ושירות מעולה
                כבר למעלה מ-15 שנה.
              </Typography>

              {/* Social Media */}
              <Box sx={{ display: "flex", gap: 1 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: social.color,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>

            {/* Quick Links */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#38bdf8",
                }}
              >
                קישורים מהירים
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {quickLinks.map((link) => (
                  <Box
                    key={link.path}
                    component={Link}
                    to={link.path}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "rgba(255, 255, 255, 0.8)",
                      textDecoration: "none",
                      py: 0.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#38bdf8",
                        transform: "translateX(-4px)",
                      },
                    }}
                  >
                    <Box sx={{ fontSize: "1rem" }}>{link.icon}</Box>
                    <Typography variant="body2">{link.name}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Product Categories */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#38bdf8",
                }}
              >
                קטגוריות מוצרים
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {productCategories.slice(0, 4).map((category) => (
                  <Box
                    key={category.path}
                    component={Link}
                    to={`/products/${category.path}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "rgba(255, 255, 255, 0.8)",
                      textDecoration: "none",
                      py: 0.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#38bdf8",
                        transform: "translateX(-4px)",
                      },
                    }}
                  >
                    <Box sx={{ fontSize: "1rem" }}>{category.icon}</Box>
                    <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                      {category.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Contact Info */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#38bdf8",
                }}
              >
                צור קשר
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {contactInfo.map((contact, index) => (
                  <Box
                    key={index}
                    component={contact.href !== "#" ? "a" : "div"}
                    href={contact.href !== "#" ? contact.href : undefined}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      color: "rgba(255, 255, 255, 0.8)",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#38bdf8",
                        transform: "translateX(-4px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: "rgba(56, 189, 248, 0.2)",
                        color: "#38bdf8",
                      }}
                    >
                      {contact.icon}
                    </Box>
                    <Typography variant="body2">{contact.text}</Typography>
                  </Box>
                ))}
              </Box>

              {/* WhatsApp Button */}
              <Box
                component="a"
                href="https://wa.me/972501234567"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 3,
                  px: 3,
                  py: 1.5,
                  backgroundColor: "#25D366",
                  color: "white",
                  borderRadius: 2,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#20ba5a",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(37, 211, 102, 0.3)",
                  },
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 20 }} />
                שלח הודעה
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom Footer */}
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 3 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            pb: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            © {new Date().getFullYear()} Ben Gigi. כל הזכויות שמורות.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-end" },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                "&:hover": { color: "#38bdf8" },
              }}
            >
              מדיניות פרטיות
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                "&:hover": { color: "#38bdf8" },
              }}
            >
              תנאי שימוש
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
