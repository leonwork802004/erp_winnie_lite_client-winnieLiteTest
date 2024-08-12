import React from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useTheme, styled } from "@mui/material/styles";

type ContentLayoutProps = {
  isOpen: boolean;
  toggle: () => void;
  sideBarWidth?: number;
  children: React.ReactNode;
};

const Main = styled("div", {
  shouldForwardProp: (prop) => prop !== "isOpen" && prop !== "sideBarWidth",
})<{
  isOpen: boolean;
  sideBarWidth: number;
}>(({ theme, isOpen, sideBarWidth }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${sideBarWidth}px`,
  ...(isOpen && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export const ContentLayout = ({
  isOpen,
  toggle,
  sideBarWidth = 240,
  children,
}: ContentLayoutProps) => {
  const theme = useTheme();
  const splitterWidth = theme.spacing(2);

  return (
    <Main isOpen={isOpen} sideBarWidth={sideBarWidth}>
      <Stack height="100%" direction="row">
        <IconButton
          onClick={toggle}
          sx={{
            borderRadius: 0,
            width: splitterWidth,
            bgcolor: "grey.100",
          }}
        >
          {isOpen ? <ArrowLeftIcon /> : <ArrowRightIcon />}
        </IconButton>
        <Box
          sx={{
            flexGrow: 1,
            padding: splitterWidth,
            paddingLeft: 0,
          }}
        >
          {children}
        </Box>
      </Stack>
    </Main>
  );
};
