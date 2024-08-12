import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { Toaster } from "react-hot-toast";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { defaultTheme as muiTheme } from "@lib/defaultTheme";
import { mobileTheme } from "@lib/muiMobileTheme";
import { queryClient } from "@lib/tanstack";
import { AlertDialog } from "@store/AlertDialog";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const defaultTheme = createTheme({
    components: { ...muiTheme, ...(isMobile ? mobileTheme : {}) },
    mixins: { MuiDataGrid: { containerBackground: "#1976d2" } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Toaster />
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AlertDialog />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};
