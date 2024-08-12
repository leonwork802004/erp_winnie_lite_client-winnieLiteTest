import React from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";

type SideBarProps = {
  isOpen: boolean;
  sideBarWidth?: number;
  children: React.ReactNode;
};

export const SideBar = ({
  isOpen,
  sideBarWidth = 240,
  children,
}: SideBarProps) => (
  <Drawer
    sx={{
      width: sideBarWidth,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: sideBarWidth,
        boxSizing: "border-box",
      },
    }}
    variant="persistent"
    open={isOpen}
  >
    <Toolbar variant="dense" />
    {children}
  </Drawer>
);
