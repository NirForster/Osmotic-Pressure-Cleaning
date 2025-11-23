// src/components/BenGigiLogo.tsx
import { Box } from "@mui/material";
import Lottie from "lottie-react";
import waterLoaderAnimation from "../assets/waterLoader_lottie.json";

interface BenGigiLogoProps {
  size?: number;
}

export default function BenGigiLogo({ size = 40 }: BenGigiLogoProps) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Lottie
        animationData={waterLoaderAnimation}
        loop
        autoplay
        style={{ width: size, height: size }}
      />
    </Box>
  );
}

