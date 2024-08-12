import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";

export const Circular = () => (
  <Container sx={{ height: "100%" }}>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100%" }}
    >
      <CircularProgress />
    </Box>
  </Container>
);
