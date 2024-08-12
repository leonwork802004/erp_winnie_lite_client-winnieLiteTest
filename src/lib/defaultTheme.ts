import { Components, Theme } from "@mui/material/styles";
import type {} from "@mui/x-tree-view/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";

export const defaultTheme: Components<Omit<Theme, "components">> = {
  MuiDataGrid: {
    styleOverrides: {
      columnHeader: {
        color: "white",
      },
    },
  },
};
