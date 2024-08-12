import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  height: "100%",
  width: "100%",
}));
