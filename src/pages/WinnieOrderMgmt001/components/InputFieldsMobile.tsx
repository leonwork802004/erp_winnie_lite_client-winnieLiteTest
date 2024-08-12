import { memo } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useDisclosure } from "@hooks/useDisclosure";
import { EnforceOrderPayload } from "../api";
import { DivButtons } from "./DivButtons";
import { DivInputField } from "./DivInputField";

type Props = {
  input: EnforceOrderPayload;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  failedInput: string;
  onFailedInputChange: (value: string) => void;
};

export const InputFieldsMobile = memo((props: Props) => {
  const { isOpen, open, close } = useDisclosure();

  return (
    <Box display={{ md: "none", xs: "block" }}>
      <IconButton onClick={open}>
        <ShoppingCartIcon />
      </IconButton>

      <Dialog onClose={close} open={isOpen} fullWidth maxWidth="lg">
        <DialogTitle>
          <Stack direction={"row"} justifyContent={"space-between"}>
            派單
            <Stack direction={"row"} spacing={1}>
              <DivButtons {...props} />
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack>
            <DivInputField {...props} />
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
});
