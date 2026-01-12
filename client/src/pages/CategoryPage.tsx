import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
} from "@mui/material";
import Loader from "../components/Loader";
import type { Product } from "../services/api";
import api from "../services/api";
import { productCategories } from "../Router";
import SEO from "../components/SEO";

const pathToCategoryName = (categoryPath: string | undefined) => {
  const found = productCategories.find((cat) => cat.path === categoryPath);
  return found ? found.name : undefined;
};

// SEO mapping for categories - Hebrew with English keywords
const categorySEO: Record<
  string,
  { title: string; description: string; keywords: string }
> = {
  accessories: {
    title: "אביזרים לשטיפת רכב | Car Wash Accessories | Ben Gigi",
    description:
      "אביזרים איכותיים לשטיפת רכב בלחץ מים ממובילי התעשייה. מגוון רחב של אביזרים מקצועיים לכל צורך. High-quality car wash accessories and equipment for professional use.",
    keywords:
      "בן גיגי, מוצרי נקיון בלחץ מים, שטיפה, אביזרים לשטיפת רכב, אביזרי שטיפת רכב, ציוד שטיפת רכב, Ben Gigi, car wash accessories, car cleaning accessories, pressure washer accessories",
  },
  "swivel-connectors": {
    title: "מחבר סיבובי - סביבל | Swivel Connectors | Ben Gigi",
    description:
      "מחברים סיבוביים מקצועיים למכונות שטיפה בלחץ מים. איכות שוויצרית מובילה מ-Mosmatic. Professional swivel connectors for pressure washing equipment.",
    keywords:
      "בן גיגי, מוצרי נקיון בלחץ מים, שטיפה, מחבר סיבובי, סביבל, מחבר סביבוני, swivel connector, swivel joint, pressure washer swivel, Ben Gigi, Mosmatic",
  },
  "pressure-washers": {
    title: "מכונות שטיפה בלחץ מים | Pressure Washers | Ben Gigi",
    description:
      "מכונות שטיפה בלחץ מים חמים או קרים לבית ולמקצוע. מגוון רחב של דגמים וספקים ממובילי התעשייה. Pressure washers for home and professional use - hot and cold water models.",
    keywords:
      "בן גיגי, מוצרי נקיון בלחץ מים, שטיפה, מכונת שטיפה, מכונת שטיפה בלחץ מים, לחץ מים, מכונת ניקוי בלחץ, pressure washer, high pressure cleaner, power washer, Ben Gigi",
  },
  "professional-equipment": {
    title:
      "ציוד ניקוי מקצועי בלחץ מים | Professional Cleaning Equipment | Ben Gigi",
    description:
      "ציוד ניקוי מקצועי ותעשייתי בלחץ מים. פתרונות מתקדמים לניקוי יעיל ומהיר. Professional and industrial high-pressure cleaning equipment.",
    keywords:
      "בן גיגי, מוצרי נקיון בלחץ מים, שטיפה, ציוד ניקוי מקצועי, ציוד ניקוי תעשייתי, מכונות ניקוי תעשייתיות, professional cleaning equipment, industrial pressure washers, Ben Gigi",
  },
  "vacuum-cleaners": {
    title: "שואבי אבק מקצועיים | Professional Vacuum Cleaners | Ben Gigi",
    description:
      "שואבי אבק תעשייתיים מקצועיים לכל סוג פסולת. פתרונות ניקוי יעילים ומהירים. Professional industrial vacuum cleaners for all types of waste.",
    keywords:
      "בן גיגי, מוצרי נקיון בלחץ מים, שטיפה, שואב אבק, שואבי אבק, שואב אבק תעשייתי, שואבי אבק מקצועיים, vacuum cleaner, industrial vacuum, professional vacuum, Ben Gigi",
  },
  "rm-brand": {
    title: "מוצרי R+M ו-Mosmatic | R+M and Mosmatic Products | Ben Gigi",
    description:
      "מוצרי R+M ו-Mosmatic המובילים בתחום מכונות שטיפה וציוד ניקוי מקצועי. איכות שוויצרית מובילה. Leading R+M and Mosmatic products for pressure washing and professional cleaning equipment.",
    keywords:
      "בן גיגי, מוצרי נקיון בלחץ מים, שטיפה, Mosmatic, R+M, מוצרי Mosmatic, מוצרי R+M, Swiss quality, pressure washing equipment, Ben Gigi",
  },
};

// Detailed category descriptions for SEO and user experience
const categoryDescriptions: Record<string, string> = {
  accessories: `אביזרים לשטיפת רכב הם חלק חיוני בכל מערכת שטיפה מקצועית. ב-Ben Gigi אנו מציעים מגוון רחב של אביזרים איכותיים המותאמים לכל סוג של מכונת שטיפה בלחץ מים. האביזרים שלנו כוללים: זרנוקים עמידים, ראשי שטיפה מתכווננים, מברשות מקצועיות, וחלקי חילוף איכותיים.

כל האביזרים שלנו מותאמים לעבודה עם מכונות שטיפה מקצועיות ונבדקים לאיכות גבוהה ואמינות. בין אם אתם מחפשים אביזרים לשטיפת רכבים פרטיים, משאיות, או ציוד כבד, תמצאו אצלנו את הפתרון המתאים. האיכות הגבוהה של האביזרים מבטיחה עבודה יעילה וחסכונית במים, תוך שמירה על איכות הניקוי הגבוהה ביותר.`,

  "swivel-connectors": `מחברים סיבוביים (סביבלים) הם רכיבים קריטיים במערכת שטיפה בלחץ מים, המאפשרים תנועה חופשית וחוסר סיבוב של הצינורות בזמן העבודה. ב-Ben Gigi אנו מייבאים מחברים סיבוביים איכותיים מ-Mosmatic השוויצרית, המובילה העולמית בתחום.

המחברים הסיבוביים שלנו בנויים לעמוד בלחצים גבוהים ובשימוש אינטנסיבי. הם מציעים ביצועים מעולים, אורך חיים ארוך, ותחזוקה מינימלית. המחברים מתאימים לכל סוגי מכונות השטיפה ומבטיחים עבודה נוחה ויעילה ללא סיבוב או כריכה של הצינורות.

איכות שוויצרית מובילה, עמידות בפני בלאי, וטכנולוגיה מתקדמת הופכים את המחברים הסיבוביים שלנו לבחירה הנכונה עבור כל מקצועי בתחום הניקוי בלחץ מים.`,

  "pressure-washers": `מכונות שטיפה בלחץ מים הן כלי עבודה חיוני לניקוי יעיל ומקצועי. ב-Ben Gigi אנו מציעים מגוון רחב של מכונות שטיפה המותאמות לצרכים שונים - ממכונות ביתיות קומפקטיות ועד מכונות תעשייתיות חזקות ומקצועיות.

המכונות שלנו מגיעות בדגמים שונים: מכונות שטיפה במים קרים למגוון שימושים, ומכונות שטיפה במים חמים לניקוי עקשן ומהיר יותר. כל המכונות מציעות טכנולוגיות מתקדמות, איכות גבוהה ואמינות ממושכת.

בין אם אתם מחפשים מכונת שטיפה לבית, לעסק קטן, לשימוש תעשייתי, או למתקני שטיפת רכבים מקצועיים, תמצאו אצלנו את הפתרון המושלם. המכונות שלנו מיובאות ממובילי התעשייה העולמית ומתאימות לתנאי השוק הישראלי.`,

  "professional-equipment": `ציוד ניקוי מקצועי בלחץ מים הוא הבסיס לכל עסק או ארגון הדורש פתרונות ניקוי יעילים ומהירים. ב-Ben Gigi אנו מתמחים בציוד ניקוי מקצועי ותעשייתי המותאם לצרכים מגוונים - ממתקני שטיפת רכבים, דרך מפעלי תעשייה, ועד מוסדות ציבוריים.

הציוד המקצועי שלנו כולל מכונות שטיפה חזקות, מערכות ניקוי מתוחכמות, ציוד עזר מקצועי, ופתרונות מותאמים אישית. כל הציוד נבדק לאיכות גבוהה, אמינות ויעילות, ומתאים לעבודה אינטנסיבית מדי יום.

אנו מספקים ייעוץ מקצועי, תמיכה טכנית, ושירות איכותי כדי לעזור לכם לבחור את הציוד המתאים ביותר לצרכים שלכם. האיכות והביצועים הגבוהים מבטיחים השקעה משתלמת לטווח הארוך.`,

  "vacuum-cleaners": `שואבי אבק מקצועיים הם כלי עבודה חיוניים לניקוי יעיל של כל סוג פסולת - מפסולת יבשה ועד נוזלים וכימיקלים. ב-Ben Gigi אנו מציעים מגוון רחב של שואבי אבק תעשייתיים מקצועיים המותאמים לצרכים שונים.

השואבים שלנו מגיעים בדגמים שונים: שואבי אבק יבשים, שואבי נוזלים, ושואבי אבק משולבים (יבש ורטוב). כל השואבים בנויים לעבודה מקצועית אינטנסיבית ומציעים ביצועים גבוהים, קיבולת גדולה, ועמידות גבוהה.

בין אם אתם מחפשים שואב אבק למתקן שטיפת רכבים, למפעל תעשייתי, למוסד ציבורי, או לשימוש מסחרי, תמצאו אצלנו את הפתרון המתאים. השואבים המקצועיים שלנו מבטיחים ניקוי יעיל ומהיר של כל סוג פסולת.`,

  "rm-brand": `מוצרי R+M ו-Mosmatic מייצגים את שיא האיכות בעולם מכונות השטיפה וציוד הניקוי המקצועי. ב-Ben Gigi אנו גאים להיות יבואנית רשמית ובלעדית של מותגים מובילים אלה בישראל.

Mosmatic השוויצרית היא מובילה עולמית בתחום אביזרים ומחברים סיבוביים למכונות שטיפה, עם יותר מ-40 שנות ניסיון וחדשנות. מוצרי R+M מציעים טכנולוגיות מתקדמות ואיכות גבוהה לכל צרכי הניקוי המקצועי.

כל המוצרים עוברים בקרת איכות קפדנית ומתאימים לתקנים בינלאומיים. האיכות השוויצרית המובילה, העמידות הגבוהה, והביצועים מעולים הופכים את המוצרים שלנו לבחירה הראשונה של אנשי מקצוע ברחבי העולם. ב-Ben Gigi אנו מספקים תמיכה מקצועית ושירות איכותי לכל מוצרי R+M ו-Mosmatic.`,
};

const CategoryPage = () => {
  const { categoryPath } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const categoryName = pathToCategoryName(categoryPath);
        console.log(
          "categoryPath:",
          categoryPath,
          "=> categoryName:",
          categoryName
        );
        if (!categoryName) {
          setProducts([]);
          setError("קטגוריה לא נמצאה");
          setLoading(false);
          return;
        }
        const response = await api.getProducts({ category: categoryName });
        console.log("API response:", response.data);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryPath]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  const category = categoryPath
    ? productCategories.find((cat) => cat.path === categoryPath)
    : null;

  const seoData = categoryPath ? categorySEO[categoryPath] : null;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
      <SEO
        title={seoData?.title || `${category?.name || "Products"} | Ben Gigi`}
        description={
          seoData?.description ||
          category?.description ||
          "Browse our selection of high-pressure cleaning devices and accessories for home and professional use."
        }
        keywords={seoData?.keywords}
        url={`https://ben-gigi.com/products/${categoryPath || ""}`}
      />
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          {pathToCategoryName(categoryPath) || "Products"}
        </Typography>
      </Box>

      {/* Category Description */}
      {categoryPath && categoryDescriptions[categoryPath] && (
        <Box
          sx={{
            mb: { xs: 4, md: 6 },
            maxWidth: "900px",
            mx: "auto",
            px: { xs: 2, md: 0 },
          }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.8,
              color: "#374151",
              whiteSpace: "pre-line",
            }}
          >
            {categoryDescriptions[categoryPath]}
          </Typography>
        </Box>
      )}

      {/* Products Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {products.map((product) => (
          <Card
            key={product.id}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-4px)",
              },
            }}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <CardMedia
              component="img"
              height="200"
              image={product.previewImage}
              alt={product.name}
              sx={{ objectFit: "contain", p: 2 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                gutterBottom
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                {product.description}
              </Typography>
              {product.sku && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  SKU: {product.sku}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default CategoryPage;
