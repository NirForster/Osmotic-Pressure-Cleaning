// components/Navbar.tsx
import React, { useState } from "react";
import Mosmatic from "../assets/osmotics logo.png";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Inventory as ProductsIcon,
  Article as ArticleIcon,
  ExpandLess,
  ExpandMore,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { productCategories } from "../Router";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProductsToggle = () => {
    setProductsOpen(!productsOpen);
  };

  const isActive = (path: string) => location.pathname === path;
  const isProductsActive = () => location.pathname.startsWith("/products");

  const menuItems = [
    { path: "/", name: "בית", icon: <HomeIcon /> },
    {
      path: "/products",
      name: "מוצרים",
      icon: <ProductsIcon />,
      hasSubmenu: true,
    },
    { path: "/articles", name: "מאמרים", icon: <ArticleIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 300, height: "100%", backgroundColor: "#fafafa" }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Ben Gigi Logo Image */}
          <Box
            sx={{
              width: 40,
              height: 40,
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
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Ben Gigi
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.path}>
            <ListItem
              component={item.hasSubmenu ? "div" : Link}
              to={!item.hasSubmenu ? item.path : undefined}
              onClick={
                item.hasSubmenu ? handleProductsToggle : handleDrawerToggle
              }
              sx={{
                borderRadius: 3,
                mb: 1,
                backgroundColor:
                  isActive(item.path) || (item.hasSubmenu && isProductsActive())
                    ? "#0ea5e9"
                    : "transparent",
                color:
                  isActive(item.path) || (item.hasSubmenu && isProductsActive())
                    ? "white"
                    : "#374151",
                "&:hover": {
                  backgroundColor:
                    isActive(item.path) ||
                    (item.hasSubmenu && isProductsActive())
                      ? "#0284c7"
                      : "#f3f4f6",
                },
                cursor: "pointer",
                transition: "all 0.3s ease",
                minHeight: 56,
              }}
            >
              <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                {item.icon}
              </Box>
              <ListItemText
                primary={item.name}
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  },
                }}
              />
              {item.hasSubmenu && (
                <Box sx={{ ml: 1 }}>
                  {productsOpen ? <ExpandLess /> : <ExpandMore />}
                </Box>
              )}
            </ListItem>

            {/* Product Categories Submenu */}
            {item.hasSubmenu && (
              <Collapse in={productsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ mb: 1 }}>
                  {productCategories.map((category) => (
                    <ListItem
                      key={category.path}
                      component={Link}
                      to={`/products/${category.path}`}
                      onClick={handleDrawerToggle}
                      sx={{
                        pl: 4,
                        pr: 2,
                        borderRadius: 3,
                        mb: 0.5,
                        minHeight: 48,
                        backgroundColor: isActive(`/products/${category.path}`)
                          ? "#0ea5e9"
                          : "transparent",
                        color: isActive(`/products/${category.path}`)
                          ? "white"
                          : "#6b7280",
                        "&:hover": {
                          backgroundColor: isActive(
                            `/products/${category.path}`
                          )
                            ? "#0284c7"
                            : "#f9fafb",
                        },
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Box sx={{ mr: 1.5, fontSize: "1.3rem" }}>
                        {category.icon}
                      </Box>
                      <ListItemText
                        primary={category.name}
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            lineHeight: 1.3,
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Contact Info */}
      <Box sx={{ mt: "auto", p: 3, borderTop: "1px solid #e0e0e0" }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, color: "#374151" }}
        >
          צור קשר
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <PhoneIcon sx={{ fontSize: 18, color: "#6b7280" }} />
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            0506362755
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <EmailIcon sx={{ fontSize: 18, color: "#6b7280" }} />
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            info@bengigi.co.il
          </Typography>
        </Box>

        {/* Mosmatic Logo in Mobile */}
        <Box sx={{ display: "flex", mt: 4 }}>
          <Box
            sx={{
              height: 60,
              width: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              backgroundColor: "rgba(14, 165, 233, 0.1)",
              borderRadius: 2,
              border: "1px solid rgba(14, 165, 233, 0.2)",
            }}
          >
            <img
              src={Mosmatic}
              alt="Mosmatic"
              style={{
                height: "100%",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid #e5e7eb",
          color: "#1f2937",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Ben Gigi Logo Image */}
            <Box
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f9ff",
                border: "2px solid #0ea5e9",
                boxShadow: "0 2px 8px rgba(14, 165, 233, 0.2)",
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
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: "bold",
                color: "#1f2937",
                textDecoration: "none",
                fontSize: { xs: "1.2rem", sm: "1.4rem" },
              }}
            >
              Ben Gigi
            </Typography>
          </Box>

          {/* Center - Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {menuItems.map((item) => (
                <Box key={item.path} sx={{ position: "relative" }}>
                  <Box
                    component={item.hasSubmenu ? "button" : Link}
                    to={!item.hasSubmenu ? item.path : undefined}
                    onClick={item.hasSubmenu ? handleProductsToggle : undefined}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textDecoration: "none",
                      border: "none",
                      backgroundColor:
                        isActive(item.path) ||
                        (item.hasSubmenu && isProductsActive())
                          ? "#eff6ff"
                          : "transparent",
                      color:
                        isActive(item.path) ||
                        (item.hasSubmenu && isProductsActive())
                          ? "#0ea5e9"
                          : "#6b7280",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#f9fafb",
                        color: "#374151",
                      },
                    }}
                  >
                    {item.icon}
                    <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                      {item.name}
                    </Typography>
                    {item.hasSubmenu && (
                      <Box sx={{ ml: 0.5 }}>
                        {productsOpen ? <ExpandLess /> : <ExpandMore />}
                      </Box>
                    )}
                  </Box>

                  {/* Desktop Dropdown */}
                  {item.hasSubmenu && productsOpen && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        mt: 1,
                        backgroundColor: "white",
                        borderRadius: 2,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        border: "1px solid #e5e7eb",
                        minWidth: 280,
                        maxHeight: 400,
                        overflowY: "auto",
                        zIndex: 1000,
                      }}
                    >
                      {productCategories.map((category) => (
                        <Box
                          key={category.path}
                          component={Link}
                          to={`/products/${category.path}`}
                          onClick={() => setProductsOpen(false)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            p: 2,
                            textDecoration: "none",
                            color: "#374151",
                            borderBottom: "1px solid #f3f4f6",
                            "&:hover": {
                              backgroundColor: "#f9fafb",
                            },
                            "&:last-child": {
                              borderBottom: "none",
                            },
                          }}
                        >
                          <Box sx={{ fontSize: "1.4rem" }}>{category.icon}</Box>
                          <Typography
                            sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                          >
                            {category.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Right Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Mosmatic Logo - Desktop Only */}
            {!isMobile && (
              <Box
                sx={{
                  height: { xs: 28, sm: 32 },
                  width: "auto",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={Mosmatic}
                  alt="Mosmatic"
                  style={{
                    height: "100%",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: "#6b7280",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 300,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Overlay for desktop dropdown */}
      {!isMobile && productsOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setProductsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
