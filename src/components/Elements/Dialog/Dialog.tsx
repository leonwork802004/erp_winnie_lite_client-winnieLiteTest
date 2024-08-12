import { ReactNode } from "react";
import Button from "@mui/material/Button";
import MuiDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Breakpoint, SxProps, Theme } from "@mui/material/styles";

type DialogProps = {
  isOpen: boolean;
  title: string;
  size: Breakpoint;
  onCancel: () => void;
  onConfirm: () => void;
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export const Dialog = ({
  isOpen,
  title,
  size,
  onCancel,
  onConfirm,
  children,
  sx,
}: DialogProps) => {
  return (
    <MuiDialog sx={sx} open={isOpen} maxWidth={size} fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>{children}</DialogContent>

      <DialogActions>
        <Button onClick={onCancel} variant="outlined" color="inherit">
          取消
        </Button>
        <Button onClick={onConfirm} variant="contained">
          確定
        </Button>
      </DialogActions>
    </MuiDialog>
  );
};
