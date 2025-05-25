import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Outlet, useNavigate } from "react-router-dom";

const categories = [
  { id: "accessories", name: "אביזרים", image: "/images/accessories.jpg" },
  { id: "vacuums", name: "שואבים", image: "/images/vacuums.jpg" },
  { id: "machines", name: "מכונות", image: "/images/machines.jpg" },
];

function ProductsPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 6 } }}>
      <Typography variant="h4" component="h1" gutterBottom align="right">
        מוצרים
      </Typography>
      <Grid container spacing={3} direction="row-reverse">
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card
              sx={{
                cursor: "pointer",
                height: 240,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "stretch",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
              onClick={() => navigate(`/products/${category.id}`)}
            >
              <Box
                sx={{
                  height: 140,
                  backgroundColor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Placeholder for category image */}
                <Typography variant="h6">{category.name}</Typography>
              </Box>
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                {/* Only show the name once */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4}>
        <Outlet />
      </Box>
    </Container>
  );
}

export default ProductsPage;
