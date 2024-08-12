import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Dialog } from "@components/Elements";
import { UserButton } from "@features/userButton";
import { useDisclosure } from "@hooks/useDisclosure";
import { permissionApi, permissionKeys, PermissionType } from "../api";
import { buttons } from "../utils";

type AddDataDialogProps = {
  fetchDataPayload: PermissionType.FetchDataPayload;
};

export const AddDataDialog = memo(
  ({ fetchDataPayload }: AddDataDialogProps) => {
    const queryClient = useQueryClient();
    const { isOpen, open, close } = useDisclosure();

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<PermissionType.AddDataPayload>({
      defaultValues: {
        Auth: 1,
        LinkId: "",
        Status: 1,
        Title: "",
      },
      resolver: zodResolver(PermissionType.addDataPayload),
    });

    const { mutate, isPending } = permissionApi.useAddData();

    const handleClose = () => {
      close();
      reset();
    };

    const handleConfirm = () => {
      handleSubmit((data) => {
        mutate(data, {
          onSuccess: async (data) => {
            handleClose();
            toast.success(`${data.Msg} 流水序號:${data.Data.Id}`);

            queryClient.invalidateQueries({
              queryKey: permissionKeys.data(fetchDataPayload),
            });
          },
          onError: (error: any) => {
            const message =
              error?.response?.data?.Msg || `新增失敗 ${error?.message}`;
            toast.error(message);
          },
        });
      })();
    };

    return (
      <>
        <UserButton
          isLoading={isPending}
          featureName={buttons.addPerm}
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={open}
        >
          新增權限
        </UserButton>

        <Dialog
          isOpen={isOpen}
          size="xs"
          title="新增權限"
          onCancel={handleClose}
          onConfirm={handleConfirm}
        >
          <Stack p={1} spacing={2}>
            <TextField
              size="small"
              label="授權類型"
              select
              {...register("Auth")}
              defaultValue={1}
            >
              <MenuItem value={1}>按鈕權限</MenuItem>
              <MenuItem value={2}>畫面權限</MenuItem>
              <MenuItem value={3}>API 權限</MenuItem>
            </TextField>
            <TextField
              size="small"
              label="關聯流水序號"
              required
              {...register("LinkId")}
              helperText={errors.LinkId?.message}
              error={!!errors.LinkId}
            />
            <TextField
              size="small"
              label="權限名稱、說明"
              {...register("Title")}
            />
            <TextField
              size="small"
              label="權限狀態"
              select
              {...register("Status")}
              defaultValue={1}
            >
              <MenuItem value={1}>啟用</MenuItem>
              <MenuItem value={0}>停用</MenuItem>
            </TextField>
          </Stack>
        </Dialog>
      </>
    );
  }
);
