import { useQueryClient } from "@tanstack/react-query";
import { memo, useState } from "react";
import toast from "react-hot-toast";
import TimelineIcon from "@mui/icons-material/Timeline";
import Typography from "@mui/material/Typography";
import { Dialog } from "@components/Elements";
import { UserButton } from "@features/userButton";
import { useDisclosure } from "@hooks/useDisclosure";
import { useAlertDialogStore } from "@store/AlertDialog";
import { useMoveTrees } from "../api";
import { buttons } from "../utils";
import { RoleAutocomplete, RoleOption } from ".";

type MoveTreesDialogProps = {
  id: number | undefined;
  title: string | undefined;
};

export const MoveTreesDialog = memo(({ id, title }: MoveTreesDialogProps) => {
  const queryClient = useQueryClient();
  const { showDialog } = useAlertDialogStore();
  const { isOpen, open, close } = useDisclosure();
  const { mutate, isPending } = useMoveTrees();

  const [option, setOption] = useState<RoleOption | null>(null);
  const handleOptionChange = (_event: any, newValue: RoleOption | null) => {
    setOption(newValue);
  };

  const handleOpen = () => {
    if (!id || !title) {
      toast.error("請選擇要移動的角色");
      return;
    }
    open();
  };

  const handleClose = () => {
    setOption(null);
    close();
  };

  const handleConfirm = () => {
    if (!option || !id) {
      toast.error("請選擇想要移動到的節點");
      return;
    }

    showDialog({
      title: "確定移動節點?",
      message: `移動  Id:${id} ${title}  至  Id:${option.id} ${option.label}  下層`,
      action: () =>
        mutate(
          { id: id, toParent: option.id },
          {
            onSuccess: async (data) => {
              toast.success(data.Msg);

              handleClose();

              queryClient.invalidateQueries({
                queryKey: ["role", "trees"],
              });
            },
            onError: (error: any) => {
              const message =
                error?.response?.data?.Msg || `移動失敗 ${error?.message}`;
              toast.error(message);
            },
          }
        ),
    });
  };

  return (
    <>
      <UserButton
        featureName={buttons.moveRole}
        isLoading={isPending}
        variant="outlined"
        startIcon={<TimelineIcon />}
        onClick={handleOpen}
      >
        移動節點
      </UserButton>

      <Dialog
        isOpen={isOpen}
        title="移動節點"
        size="sm"
        onCancel={handleClose}
        onConfirm={handleConfirm}
        sx={{ height: 600 }}
      >
        <Typography>
          移動 Id:{id} {title} 至
        </Typography>
        <RoleAutocomplete option={option} onOptionChange={handleOptionChange} />
      </Dialog>
    </>
  );
});
