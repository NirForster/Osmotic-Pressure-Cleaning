// src/components/Loader.tsx
import { Box } from "@mui/material";
import Lottie from "lottie-react";
import waterLoaderAnimation from "../assets/waterLoader_lottie.json";

interface LoaderProps {
  size?: number;
  fullScreen?: boolean;
}

export default function Loader({ size = 200, fullScreen = false }: LoaderProps) {
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
        animationData={waterLoaderAnimation}
        loop
        autoplay
        style={{ width: size, height: size }}
      />
    </Box>
  );
}

