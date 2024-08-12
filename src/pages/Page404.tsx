import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const Page404 = () => {
  return (
    <>
      <Container sx={{ height: "100%", width: "100%" }}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            pt: 15,
          }}
        >
          <Typography variant="h1" paragraph sx={{ color: "text.disabled" }}>
            404
          </Typography>

          <Typography variant="h4" paragraph sx={{ color: "text.secondary" }}>
            Sorry, we couldn't find this page.
          </Typography>

          <Button
            sx={{ my: 2 }}
            to="/"
            size="large"
            variant="contained"
            component={RouterLink}
          >
            回首頁
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Page404;
