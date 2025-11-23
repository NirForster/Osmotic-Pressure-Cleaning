// components/Footer.tsx
import { Link } from "react-router-dom";
import { Box, Container, Typography, IconButton, Divider } from "@mui/material";
import { getAssetUrl } from "../config/cloudinaryAssets";
import BenGigiLogo from "./BenGigiLogo";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  MusicNote as TikTokIcon,
  Home as HomeIcon,
  Inventory as ProductsIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import { productCategories } from "../Router";

const Footer = () => {
  const quickLinks = [
    { path: "/", name: "בית", icon: <HomeIcon />, external: false },
    { path: "https://www.mosmatic.com/downloads/catalog/ME25/", name: "מוצרים", icon: <ProductsIcon />, external: true },
    { path: "/articles", name: "מאמרים", icon: <ArticleIcon />, external: false },
  ];

  const contactInfo = [
    {
      icon: <PhoneIcon />,
      text: "0506362755",
      href: "tel:+972506362755",
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
      href: "https://wa.me/972506362755",
      color: "#25D366",
    },
    {
      icon: <TikTokIcon />,
      href: "https://www.tiktok.com/@ben.gigi.ltd",
      color: "#000000",
    },
    {
      icon: <InstagramIcon />,
      href: "https://www.instagram.com/ben_gigi_ltd/",
      color: "#E4405F",
    },
    {
      icon: <YouTubeIcon />,
      href: "https://www.youtube.com/channel/UC2Z561ujJDRKGTqK9VrdRmw/featured",
      color: "#FF0000",
    },
    {
      icon: <FacebookIcon />,
      href: "https://www.facebook.com/mosmatic.israel/?fref=ts",
      color: "#1877F2",
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
      {/* Background Pattern - Modern Mesh Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.15) 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, rgba(2, 132, 199, 0.15) 0%, transparent 50%),
                       radial-gradient(circle at 40% 20%, rgba(8, 145, 178, 0.1) 0%, transparent 50%)`,
          opacity: 0.8,
        }}
      />
      {/* Subtle Grid Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
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
                  <BenGigiLogo size={50} />
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
                  component="a"
                  href="https://www.mosmatic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    height: 36,
                    width: "auto",
                    ml: 1,
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    transition: "opacity 0.3s ease",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                >
                  <img
                    src={getAssetUrl("osmoticsLogo")}
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
                    component={link.external ? "a" : Link}
                    {...(link.external ? { href: link.path, target: "_blank", rel: "noopener noreferrer" } : { to: link.path })}
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
                href="https://wa.me/972506362755"
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
