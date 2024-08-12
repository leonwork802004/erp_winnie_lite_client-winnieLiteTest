import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Dialog } from "@components/Elements";
import { RoleTreeSchema, RoleTrees } from "@features/roleTrees";
import { UserButton } from "@features/userButton";
import { useDisclosure } from "@hooks/useDisclosure";
import { useAlertDialogStore } from "@store/AlertDialog";
import { permissionApi, permissionKeys } from "../api";
import { buttons } from "../utils";

type SetLinkRolesDialogProps = {
  Id: number;
  Filter: number;
};

export const SetLinkRolesDialog = ({ Id, Filter }: SetLinkRolesDialogProps) => {
  const queryClient = useQueryClient();
  const { showDialog } = useAlertDialogStore();
  const { isOpen, close, open } = useDisclosure();

  const { data: linkRoles } = permissionApi.useFetchLinkRoles(Id, true);
  const { mutate, isPending } = permissionApi.useSetLinkRoles();

  const linkRoleId = useMemo(
    () => linkRoles?.Data?.map((item) => item.Id),
    [linkRoles]
  );

  const [selectedItem, setSelectedItem] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<RoleTreeSchema | null>(null);

  const grantType = useMemo(() => {
    switch (Filter) {
      case 1:
        return "授權";
      case 2:
        return "禁用";
      default:
        return "";
    }
  }, [Filter]);

  const handleSelectedItemChange = useCallback((id: string) => {
    setSelectedItem(id);
  }, []);
  const handleSelectedRoleChange = useCallback((role: RoleTreeSchema) => {
    setSelectedRole(role);
  }, []);

  const handleConfirm = () => {
    if (!grantType) {
      return;
    }

    if (!selectedItem || !selectedRole) {
      toast.error(`請選擇要${grantType}的權限`);
      return;
    }

    showDialog({
      title: `確定${grantType}角色權限?`,
      message: `新增 Id:${selectedRole.Id} ${selectedRole.Title} 權限`,
      action: () =>
        mutate(
          { id: Id, roleId: selectedRole.Id, filter: Filter },
          {
            onSuccess: async (data) => {
              toast.success(`對應角色權限流水序號:${data.Data.Id} ${data.Msg}`);

              queryClient.invalidateQueries({
                queryKey: permissionKeys.linkRoles(),
              });

              close();
            },
            onError: (error: any) => {
              const message =
                error?.response?.data?.Msg || `新增失敗 ${error?.message}`;
              toast.error(message);
            },
          }
        ),
    });
  };

  return (
    <>
      <UserButton
        isLoading={isPending}
        featureName={buttons.setRoles}
        variant="contained"
        startIcon={<PersonAddIcon />}
        onClick={open}
      >
        {grantType}角色權限
      </UserButton>

      <Dialog
        isOpen={isOpen}
        size="sm"
        title="新增角色權限"
        onCancel={close}
        onConfirm={handleConfirm}
      >
        <RoleTrees
          linkRoleId={linkRoleId}
          selectedItem={selectedItem}
          onSelectedItemChange={handleSelectedItemChange}
          onSelectedRoleChange={handleSelectedRoleChange}
        />
      </Dialog>
    </>
  );
};
