import { Components, Theme } from "@mui/material/styles";

export const mobileTheme: Components<Omit<Theme, "components">> = {
  MuiButton: {
    defaultProps: {
      size: "small",
    },
  },
  MuiInputBase: {
    defaultProps: {
      sx: {
        fontSize: "0.9rem",
      },
      inputProps: {
        sx: {
          p: 1,
        },
      },
    },
  },
  MuiInputLabel: {
    defaultProps: {
      sx: {
        fontSize: "0.9rem",
      },
    },
  },
};
