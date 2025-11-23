// src/components/Loader.tsx
import { Box } from "@mui/material";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

interface LoaderProps {
  size?: number;
  fullScreen?: boolean;
}

export default function Loader({ size = 200, fullScreen = false }: LoaderProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Load the Lottie file from public folder
    fetch("/waterLoader_lotttie.json")
      .then((response) => {
        if (!response.ok) throw new Error("File not found");
        return response.json();
      })
      .then((data) => setAnimationData(data))
      .catch((error) => {
        console.error("Error loading Lottie animation:", error);
      });
  }, []);

  if (!animationData) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: fullScreen ? "100vh" : "auto",
        minHeight: fullScreen ? "100vh" : "60vh",
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

