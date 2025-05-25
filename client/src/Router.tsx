// Router.tsx
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import Articles from "./pages/Articles";

// Simple product categories - no complex imports
export const productCategories = [
  {
    id: "accessories",
    path: "accessories",
    name: "אביזרים לשטיפת רכב",
    icon: "🔧",
    description: "אביזרים איכותיים לשטיפת רכב בלחץ מים",
  },
  {
    id: "swivel-connectors",
    path: "swivel-connectors",
    name: "מחבר סיבובי סביבל",
    icon: "🔄",
    description: "מחברים סיבוביים מקצועיים למכונות שטיפה",
  },
  {
    id: "pressure-washers",
    path: "pressure-washers",
    name: "מכונות שטיפה בלחץ מים",
    icon: "💧",
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
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/articles" element={<Articles />} />

      {/* Simple category routes for now */}
      <Route
        path="/products/accessories"
        element={
          <div style={{ padding: "20px", textAlign: "center" }}>
            אביזרים לשטיפת רכב - בקרוב
          </div>
        }
      />
      <Route
        path="/products/swivel-connectors"
        element={
          <div style={{ padding: "20px", textAlign: "center" }}>
            מחבר סיבובי סביבל - בקרוב
          </div>
        }
      />
      <Route
        path="/products/pressure-washers"
        element={
          <div style={{ padding: "20px", textAlign: "center" }}>
            מכונות שטיפה בלחץ מים - בקרוב
          </div>
        }
      />
      <Route
        path="/products/professional-equipment"
        element={
          <div style={{ padding: "20px", textAlign: "center" }}>
            ציוד ניקוי מקצועי - בקרוב
          </div>
        }
      />
      <Route
        path="/products/vacuum-cleaners"
        element={
          <div style={{ padding: "20px", textAlign: "center" }}>
            שואבי אבק - בקרוב
          </div>
        }
      />
      <Route
        path="/products/rm-brand"
        element={
          <div style={{ padding: "20px", textAlign: "center" }}>
            R+M - בקרוב
          </div>
        }
      />
    </Routes>
  );
};

export default AppRouter;
