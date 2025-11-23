// src/components/BenGigiLogo.tsx
import { Box } from "@mui/material";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

interface BenGigiLogoProps {
  size?: number;
}

export default function BenGigiLogo({ size = 40 }: BenGigiLogoProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Load the Lottie file from public folder
    // Try both possible filenames (waterLoader_lottie.json or waterLoader_lotttie.json)
    fetch("/waterLoader_lottie.json")
      .then((response) => {
        if (!response.ok) throw new Error("File not found");
        return response.json();
      })
      .then((data) => setAnimationData(data))
      .catch(() => {
        // Fallback to waterLoader_lotttie.json (with 3 t's)
        fetch("/waterLoader_lotttie.json")
          .then((response) => response.json())
          .then((data) => setAnimationData(data))
          .catch((error) => {
            console.error("Error loading Lottie animation:", error);
          });
      });
  }, []);

  if (!animationData) {
    return null;
  }

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
        animationData={animationData}
        loop
        autoplay
        style={{ width: size, height: size }}
      />
    </Box>
  );
}

