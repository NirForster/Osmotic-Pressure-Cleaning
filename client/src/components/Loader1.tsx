// src/components/Loader.tsx
import Lottie from "lottie-react";
import animationData from "../assets/waterLoader_lottie.json";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
}
