// Router.tsx
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Articles from "./pages/Articles";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import { LocalCarWash, Sync, KeyboardTab } from "@mui/icons-material";

// Simple product categories - no complex imports
export const productCategories = [
  {
    id: "accessories",
    path: "accessories",
    name: "אביזרים לשטיפת רכב",
    icon: <LocalCarWash sx={{ fontSize: "inherit" }} />,
    description: "אביזרים איכותיים לשטיפת רכב בלחץ מים",
  },
  {
    id: "swivel-connectors",
    path: "swivel-connectors",
    name: "מחבר סיבובי - סביבל",
    icon: <Sync sx={{ fontSize: "inherit" }} />,
    description: "מחברים סיבוביים מקצועיים למכונות שטיפה",
  },
  {
    id: "pressure-washers",
    path: "pressure-washers",
    name: "מכונות שטיפה בלחץ מים",
    icon: <KeyboardTab sx={{ fontSize: "inherit" }} />,
    description: "מכונות שטיפה בלחץ מים למגוון שימושים",
  },
  {
    id: "professional-equipment",
    path: "professional-equipment",
    name: "ציוד ניקוי מקצועי בלחץ מים",
    icon: "🏭",
    description: "ציוד ניקוי מקצועי לשימוש תעשייתי",
  },
  {
    id: "vacuum-cleaners",
    path: "vacuum-cleaners",
    name: "שואבי אבק",
    icon: "🌪️",
    description: "שואבי אבק מקצועיים לכל סוג פסולת",
  },
  {
    id: "rm-brand",
    path: "rm-brand",
    name: "R+M",
    icon: "⭐",
    description: "מוצרי R+M המובילים בתחום",
  },
];

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/products/:categoryPath" element={<CategoryPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
    </Routes>
  );
};

export default AppRouter;
