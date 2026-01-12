import { Container, Typography, Box, Card, CardContent } from "@mui/material";
import SEO from "../components/SEO";

const Articles = () => {
  return (
    <>
      <SEO
        title="מאמרים ומדריכים | Articles & Guides | בן גיגי | Ben Gigi"
        description="מאמרים, מדריכים וטיפים על ציוד ניקוי בלחץ מים, תחזוקת מכונות שטיפה ושיטות עבודה מומלצות. מידע מקצועי מ-Ben Gigi. Articles and guides about high-pressure cleaning equipment, maintenance tips, and best practices."
        keywords="בן גיגי, מוצרי נקיון בלחץ מים, שטיפה, מאמרים, מדריכים, טיפים לניקוי, תחזוקת מכונות שטיפה, Ben Gigi, articles, guides, pressure washer maintenance, cleaning tips"
        url="https://ben-gigi.com/articles"
      />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
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
            מאמרים ומדריכים
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              color: "#64748b",
              maxWidth: "700px",
              mx: "auto",
              mt: 2,
            }}
          >
            מדריכים מקצועיים, טיפים ומידע שימושי על ציוד ניקוי בלחץ מים, תחזוקה,
            ושיטות עבודה מומלצות
          </Typography>
        </Box>

        {/* Content Section */}
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          <Card sx={{ p: { xs: 3, md: 4 } }}>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 3 }}
              >
                מדריכים מקצועיים וטיפים שימושיים
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.8,
                  color: "#374151",
                  mb: 3,
                }}
              >
                כאן תמצאו מאמרים ומדריכים מקצועיים על ציוד ניקוי בלחץ מים,
                תחזוקת מכונות שטיפה, ושיטות עבודה מומלצות. המדריכים שלנו נכתבו
                על ידי מומחים בתחום ומספקים מידע מעשי ויעיל.
              </Typography>

              {/* Placeholder for future articles */}
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px dashed #cbd5e1",
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  תוכן המאמרים יופיע כאן בקרוב
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, fontSize: "0.875rem" }}
                >
                  Articles content coming soon
                </Typography>
              </Box>

              {/* Suggested Article Topics */}
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  נושאים עתידיים:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    pl: 2,
                    "& li": {
                      mb: 1,
                      color: "#64748b",
                    },
                  }}
                >
                  <li>
                    <Typography variant="body2">
                      איך לבחור מכונת שטיפה - מדריך מקיף
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      תחזוקת מכונת שטיפה - טיפים מקצועיים
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      הבדלים בין מכונת שטיפה חמה וקרה
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      אביזרים חיוניים למכונת שטיפה
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      איך לנקות רכב עם מכונת שטיפה
                    </Typography>
                  </li>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Articles;
