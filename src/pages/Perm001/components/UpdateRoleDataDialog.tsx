import { useQueryClient } from "@tanstack/react-query";
import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Dialog } from "@components/Elements";
import { UserButton } from "@features/userButton";
import { useDisclosure } from "@hooks/useDisclosure";
import { UpdateRoleDataPayload, useUpdateRoleData } from "../api";
import { buttons } from "../utils";

type Props = {
  id: number | undefined;
  title: string | undefined;
  status: number | undefined;
};

export const UpdateRoleDataDialog = memo(({ id, title, status }: Props) => {
  const queryClient = useQueryClient();
  const { isOpen, open, close } = useDisclosure();

  const { register, handleSubmit, reset, setValue } =
    useForm<UpdateRoleDataPayload>();
  const { mutate, isPending } = useUpdateRoleData();

  const handleOpen = () => {
    if (!id || !title) {
      toast.error("請選擇要修改的角色");
      return;
    }
    open();
  };

  const handleClose = () => {
    close();
    reset({ Title: title });
  };

  const handleConfirm = () => {
    handleSubmit((data) => {
      mutate(
        {
          id: id as number,
          Title: data.Title,
          Status: status == data.Status ? undefined : data.Status,
        },
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
              error?.response?.data?.Msg || `修改失敗 ${error?.message}`;
            toast.error(message);
          },
        }
      );
    })();
  };

  useEffect(() => {
    setValue("Title", title as string);
  }, [setValue, title]);

  return (
    <>
      <UserButton
        featureName={buttons.modifyRole}
        isLoading={isPending}
        variant="outlined"
        startIcon={<ManageAccountsIcon />}
        onClick={handleOpen}
      >
        修改角色
      </UserButton>

      <Dialog
        isOpen={isOpen}
        title="修改角色"
        size="sm"
        onCancel={handleClose}
        onConfirm={handleConfirm}
        sx={{ height: 600 }}
      >
        <Stack mt={1} spacing={2}>
          <TextField size="small" label="角色說明" {...register("Title")} />

          <TextField
            size="small"
            label="權限狀態"
            select
            defaultValue={status}
            required
            {...register("Status")}
          >
            <MenuItem value={1}>啟用</MenuItem>
            <MenuItem value={0}>停用</MenuItem>
          </TextField>
        </Stack>
      </Dialog>
    </>
  );
});
