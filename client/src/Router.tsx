import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Products from "./pages/products/Products";
import Articles from "./pages/Articles";
import Products1 from "./pages/products/subProducts/Products1";
import Products2 from "./pages/products/subProducts/Products2";
import Products3 from "./pages/products/subProducts/Products3";
import Products4 from "./pages/products/subProducts/Products4";
import Products5 from "./pages/products/subProducts/Products5";
import Products6 from "./pages/products/subProducts/Products6";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<Products />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/products" element={<Products />}>
        {[
          { path: "אביזרים-לשטיפת-רכב", components: <Products1 /> },
          { path: "מחבר-סיבובי-סביבל", components: <Products2 /> },
          { path: "מכונות-שטיפה-בלחץ-מים", components: <Products3 /> },
          { path: "ציוד-ניקוי-מקצועי-בלחץ-מים", components: <Products4 /> },
          { path: "שואבי אבק", components: <Products5 /> },
          { path: "R+M", components: <Products6 /> },
        ].map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={
              <div className="flex justify-center">{page.components}</div>
            }
          />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRouter;
