import { useEffect, useState } from "react";
import { Box, IconButton, Typography, Button, Grow } from "@mui/material";
import {
  WhatsApp as WhatsAppIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { WHATSAPP_NUMBER } from "../config/siteConfig";

const POPUP_DELAY_MS = 5000;

const WHATSAPP_CHAT_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "שלום, אשמח לקבל מידע"
)}`;

const WhatsAppPopup = () => {
  const [showWidget, setShowWidget] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWidget(true);
      setShowBubble(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseBubble = () => {
    setShowBubble(false);
  };

  const handleOpenChat = () => {
    window.open(WHATSAPP_CHAT_URL, "_blank", "noopener,noreferrer");
  };

  if (!showWidget) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 20, sm: 28 },
        right: { xs: 20, sm: 28 },
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        direction: "ltr",
        gap: 1.5,
      }}
    >
      <Grow in={showBubble} timeout={500}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            p: 2,
            width: 280,
            border: "1px solid #e2e8f0",
            direction: "rtl",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              צריכים עזרה?
            </Typography>
            <IconButton
              size="small"
              onClick={handleCloseBubble}
              aria-label="סגור"
              sx={{ mt: -0.5, mr: -0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            נשמח לענות על כל שאלה ולעזור לכם למצוא את המוצר המתאים.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={handleOpenChat}
            sx={{
              backgroundColor: "#25D366",
              fontWeight: 700,
              gap: 1.5,
              "&:hover": { backgroundColor: "#1da851" },
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 20 }} />
            שלחו לנו הודעה
          </Button>
        </Box>
      </Grow>

      <IconButton
        onClick={handleOpenChat}
        aria-label="פתח שיחה בוואטסאפ"
        sx={{
          width: 56,
          height: 56,
          backgroundColor: "#25D366",
          color: "white",
          boxShadow: "0 4px 16px rgba(37, 211, 102, 0.45)",
          "&:hover": {
            backgroundColor: "#1da851",
            boxShadow: "0 6px 20px rgba(37, 211, 102, 0.55)",
          },
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 30 }} />
      </IconButton>
    </Box>
  );
};

export default WhatsAppPopup;
