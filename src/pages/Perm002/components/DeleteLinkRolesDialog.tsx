import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { UserButton } from "@features/userButton";
import { useAlertDialogStore } from "@store/AlertDialog";
import { PermissionType, permissionApi, permissionKeys } from "../api";
import { buttons } from "../utils";

type DeleteLinkRolesDialogProps = {
  Id: number;
  selected: PermissionType.RoleDataSchema | null;
  onSelectedClick: (row: PermissionType.RoleDataSchema | null) => void;
};

export const DeleteLinkRolesDialog = ({
  Id,
  selected,
  onSelectedClick,
}: DeleteLinkRolesDialogProps) => {
  const queryClient = useQueryClient();
  const { showDialog } = useAlertDialogStore();
  const { mutate, isPending } = permissionApi.useDeleteLinkRoles();

  const handleDialogOpen = () => {
    if (!selected) {
      toast.error("請選擇要移除的權限");
      return;
    }

    if (selected.Inherited === 1) {
      toast.error("繼承權限無法移除");
      return;
    }

    showDialog({
      title: "是否移除角色權限?",
      message: `移除 ${selected?.Title} 權限`,
      action: handleConfirm,
    });
  };

  const handleConfirm = () => {
    mutate(
      { id: Id, roleId: Number(selected?.Id), filter: undefined  },
      {
        onSuccess: async (data) => {
          toast.success(`${data.Msg}`);

          onSelectedClick(null);

          queryClient.invalidateQueries({
            queryKey: permissionKeys.linkRoles(),
          });
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.Msg || `移除失敗 ${error?.message}`;
          toast.error(message);
        },
      }
    );
  };

  return (
    <UserButton
      featureName={buttons.delRoles}
      isLoading={isPending}
      variant="outlined"
      startIcon={<PersonRemoveIcon />}
      onClick={handleDialogOpen}
    >
      移除角色權限
    </UserButton>
  );
};
