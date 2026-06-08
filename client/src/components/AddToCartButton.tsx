import { useState } from "react";
import { Button, Box, IconButton, Typography } from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import type { Product } from "../services/api";

interface AddToCartButtonProps {
  product: Product;
  fullWidth?: boolean;
}

const AddToCartButton = ({ product, fullWidth = false }: AddToCartButtonProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addItem(product, quantity);
    setQuantity(1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: 2,
        mt: 3,
        pt: 3,
        borderTop: "1px solid #e2e8f0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          px: 1,
          py: 0.5,
          alignSelf: { xs: "center", sm: "auto" },
        }}
      >
        <IconButton
          size="small"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="הפחת כמות"
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography
          sx={{ minWidth: 32, textAlign: "center", fontWeight: 600 }}
        >
          {quantity}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setQuantity((q) => q + 1)}
          aria-label="הוסף כמות"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        fullWidth={fullWidth}
        sx={{ flex: fullWidth ? undefined : 1, gap: 1.5 }}
      >
        <ShoppingCartIcon sx={{ fontSize: 20 }} />
        הוסף לעגלה
      </Button>
    </Box>
  );
};

export default AddToCartButton;
