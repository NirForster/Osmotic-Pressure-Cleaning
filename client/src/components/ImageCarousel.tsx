import React, { useState, useEffect } from "react";
import { Box, IconButton, Fade } from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onImageError?: (imageUrl: string) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt,
  height = 350,
  autoPlay = false,
  autoPlayInterval = 3500,
  onImageError,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Reset to first image when images change, and ensure index is valid
  useEffect(() => {
    setCurrentIndex(0);
    setLoadedImages(new Set());
  }, [images]);

  // Ensure currentIndex is valid when images array changes
  useEffect(() => {
    if (images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: height,
        overflow: "hidden",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Images Container */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {images.map((img, index) => (
          <Fade
            key={img}
            in={index === currentIndex}
            timeout={500}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: index === currentIndex ? "flex" : "none",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: loadedImages.has(index) ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <img
                src={img}
                alt={`${alt} - תמונה ${index + 1}`}
                onLoad={() => handleImageLoad(index)}
                onError={() => {
                  console.error("Image failed to load:", img);
                  if (onImageError) {
                    onImageError(img);
                  }
                }}
                style={{
                  maxHeight: height - 30,
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Fade>
        ))}
      </Box>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <IconButton
            onClick={goToPrevious}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              color: "#1e293b",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              width: 48,
              height: 48,
              zIndex: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                transform: "translateY(-50%) scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
            aria-label="Previous image"
          >
            <ArrowBackIos />
          </IconButton>

          <IconButton
            onClick={goToNext}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              color: "#1e293b",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              width: 48,
              height: 48,
              zIndex: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                transform: "translateY(-50%) scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
            aria-label="Next image"
          >
            <ArrowForwardIos />
          </IconButton>
        </>
      )}

      {/* Indicators */}
      {images.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            zIndex: 2,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentIndex === index
                    ? "rgba(14, 165, 233, 0.9)"
                    : "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor:
                    currentIndex === index
                      ? "rgba(14, 165, 233, 1)"
                      : "rgba(255, 255, 255, 0.9)",
                  transform: "scale(1.2)",
                },
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </Box>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            padding: "4px 12px",
            borderRadius: 2,
            fontSize: "0.875rem",
            zIndex: 2,
          }}
        >
          {currentIndex + 1} / {images.length}
        </Box>
      )}
    </Box>
  );
};

export default ImageCarousel;

