import { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  WhatsApp as WhatsAppIcon,
  ShoppingCart as ShoppingCartIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { buildWhatsAppOrderUrl } from "../utils/buildWhatsAppOrderUrl";

const CartDrawer = () => {
  const {
    items,
    itemCount,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClose = () => {
    closeCart();
    setErrors({});
    setConfirmOpen(false);
  };

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {};
    if (!customerName.trim()) {
      newErrors.name = "נא להזין שם";
    }
    if (!customerPhone.trim()) {
      newErrors.phone = "נא להזין מספר טלפון";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = () => {
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const handleConfirmAndSend = () => {
    const url = buildWhatsAppOrderUrl(items, {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      notes: notes.trim() || undefined,
    });

    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    setCustomerName("");
    setCustomerPhone("");
    setNotes("");
    setErrors({});
    setConfirmOpen(false);
    closeCart();
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={isCartOpen}
        onClose={handleClose}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 420 }, maxWidth: "100vw" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: "1px solid #e2e8f0",
              background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ShoppingCartIcon />
              <Typography variant="h6" fontWeight={700}>
                העגלה שלי ({itemCount})
              </Typography>
            </Box>
            <IconButton onClick={handleClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {items.length === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                color: "text.secondary",
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" gutterBottom>
                העגלה ריקה
              </Typography>
              <Typography variant="body2" align="center">
                הוסיפו מוצרים מהאתר כדי להתחיל
              </Typography>
            </Box>
          ) : (
            <>
              <List sx={{ flex: 1, overflow: "auto", py: 0 }}>
                {items.map((item) => (
                  <ListItem
                    key={item.productId}
                    sx={{
                      flexDirection: "column",
                      alignItems: "stretch",
                      py: 2,
                      px: 2,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      {item.previewImage && (
                        <Avatar
                          src={item.previewImage}
                          alt={item.name}
                          variant="rounded"
                          sx={{ width: 56, height: 56, flexShrink: 0 }}
                        />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {item.name}
                        </Typography>
                        {item.sku && (
                          <Typography variant="caption" color="text.secondary">
                            SKU: {item.sku}
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => removeItem(item.productId)}
                        aria-label="הסר מהעגלה"
                        sx={{ color: "error.main", alignSelf: "flex-start" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1.5,
                        mr: item.previewImage ? 7 : 0,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label="הפחת כמות"
                        sx={{ border: "1px solid #e2e8f0" }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        sx={{
                          minWidth: 24,
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label="הוסף כמות"
                        sx={{ border: "1px solid #e2e8f0" }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>

              <Divider />

              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  פרטי הזמנה
                </Typography>

                <TextField
                  label="שם מלא"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="טלפון"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  fullWidth
                  size="small"
                  type="tel"
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="הערות (אופציונלי)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleSubmitOrder}
                  sx={{ fontWeight: 700, gap: 1.5 }}
                >
                  <SendIcon sx={{ fontSize: 20 }} />
                  שליחת הזמנה
                </Button>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textAlign: "center", mt: 1.5 }}
                >
                  {itemCount} פריטים · נציג יאשר את ההזמנה ויצור קשר בהקדם
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>ההזמנה מוכנה לשליחה</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            כל הפרטים מולאו. בלחיצה על &quot;המשך&quot; תועברו לשיחה עם הצוות שלנו
            להשלמת ההזמנה — ההודעה תישלח אליכם מוכנה, רק ללחוץ שליחה.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            חזרה
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmAndSend}
            sx={{
              backgroundColor: "#25D366",
              fontWeight: 700,
              gap: 1.5,
              px: 2.5,
              "&:hover": { backgroundColor: "#1da851" },
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 20 }} />
            המשך
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartDrawer;
