import React from "react";
import Box, { BoxProps } from "@mui/material/Box";

type TabPanelProps = BoxProps & {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export const TabPanel = ({
  children,
  index,
  value,
  ...props
}: TabPanelProps) => {
  return (
    <Box role="tabpanel" hidden={value !== index} height={"100%"} {...props}>
      {value === index && children}
    </Box>
  );
};
