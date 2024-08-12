import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Circular } from "@components/Elements";
import { useFetchUserInfo } from "./api";

const Home = () => {
  const { data, isLoading } = useFetchUserInfo();

  if (isLoading) {
    return <Circular />;
  }

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
          <Typography variant="h3" paragraph sx={{ color: "text.disabled" }}>
            Welcome ! {data?.Name}
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Home;
