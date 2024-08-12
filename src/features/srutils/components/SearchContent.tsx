import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DisplayItemSchema } from "../api";

type SearchContentProps = {
  title: string;
  buttonText: string;
  item: DisplayItemSchema;
  onItemChange: (item: DisplayItemSchema) => void;
  children: React.ReactNode;
  open: () => void;
};

export const SearchContent = ({
  title,
  buttonText,
  item = {
    Key: "",
    Display: "",
  },
  onItemChange,
  children,
  open,
}: SearchContentProps) => {
  // input change
  const handleDisplayItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onItemChange({ ...item, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography>{title}</Typography>
      <TextField
        size="small"
        name="Key"
        value={item.Key}
        onChange={handleDisplayItemChange}
        fullWidth
      />
      <Box sx={{ display: "flex", pt: 1 }}>
        <TextField
          size="small"
          name="Display"
          value={item.Display}
          onChange={handleDisplayItemChange}
        />
        <Button
          onClick={open}
          variant="outlined"
          size="small"
          sx={{ whiteSpace: "nowrap" }}
        >
          {buttonText}
        </Button>
      </Box>
      {children}
    </Box>
  );
};
