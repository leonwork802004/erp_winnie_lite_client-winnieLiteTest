import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { useFetchUserRoot } from "@api/userRoot";
import { Circular } from "../Elements";
import { Header } from "../Head";

export const MainLayout = () => {
  const theme = useTheme();
  const { isLoading } = useFetchUserRoot();

  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Stack minHeight={"100dvh"} width={"100dvw"}>
        <Toolbar variant="dense" />
        <Suspense fallback={<Circular />}>
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: theme.palette.grey[100],
              display: "flex",
            }}
          >
            {isLoading ? <Circular /> : <Outlet />}
          </Box>
        </Suspense>
      </Stack>
    </Box>
  );
};
