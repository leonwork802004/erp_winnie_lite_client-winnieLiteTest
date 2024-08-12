import { memo } from "react";
import toast from "react-hot-toast";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Dialog } from "@components/Elements";
import { UserButton } from "@features/userButton";
import { useDisclosure } from "@hooks/useDisclosure";
import { GetPCoinActDataPayload } from "../api";
import { buttons } from "../utils";

type Props = {
  ActId?: string;
  ActStatus?: string;
  getDataPayload: GetPCoinActDataPayload;
};

export const ReleaseDialog = memo(({ ActId, ActStatus }: Props) => {
  const { isOpen, open, close } = useDisclosure();

  const handleOpen = () => {
    if (!ActId) {
      toast.error("請選擇要放行的資料");
      return;
    }

    if (ActStatus !== "-1") {
      toast.error("活動狀態不為待審核，活動無法強制放行");
      return;
    }

    open();
  };

  const handleConfirm = () => {};

  return (
    <>
      <UserButton
        featureName={buttons.release}
        endIcon={<CheckCircleOutlineIcon />}
        variant="outlined"
        onClick={handleOpen}
      >
        活動強制放行
      </UserButton>

      <Dialog
        isOpen={isOpen}
        title="活動強制放行"
        size={"xs"}
        onCancel={close}
        onConfirm={handleConfirm}
      >
        <TextField fullWidth label="放行人" size="small" sx={{ mt: 1 }} select>
          <MenuItem>測試</MenuItem>
        </TextField>
      </Dialog>
    </>
  );
});
