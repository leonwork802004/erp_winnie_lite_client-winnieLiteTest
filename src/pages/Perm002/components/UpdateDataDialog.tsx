import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Dialog } from "@components/Elements";
import { UserButton } from "@features/userButton";
import { useDisclosure } from "@hooks/useDisclosure";
import { permissionApi, permissionKeys, PermissionType } from "../api";
import { buttons } from "../utils";

type UpdateDataDialogProps = {
  data: PermissionType.PageDataSchema | null;
  fetchDataPayload: PermissionType.FetchDataPayload;
};

export const UpdateDataDialog = ({
  data: permissionData,
  fetchDataPayload,
}: UpdateDataDialogProps) => {
  const queryClient = useQueryClient();
  const { isOpen, close, open } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionType.UpdateDataPayload>({
    defaultValues: {
      Id: permissionData?.Id,
      Status: permissionData?.Status,
      Title: permissionData?.Title,
    },
    resolver: zodResolver(PermissionType.updateDataPayload),
  });
  const { mutate, isPending } = permissionApi.useUpdateData();

  const handleOpen = () => {
    if (!permissionData) {
      toast.error("請選擇要修改的權限");
      return;
    }
    open();
  };

  const handleConfirm = () => {
    handleSubmit((data) => {
      mutate(data, {
        onSuccess: (data) => {
          toast.success(`${data.Msg} 資料異動筆數:${data.Data}`);

          close();

          queryClient.invalidateQueries({
            queryKey: permissionKeys.data(fetchDataPayload),
          });
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.Msg || `更新失敗 ${error?.message}`;
          toast.error(message);
        },
      });
    })();
  };

  useEffect(() => {
    reset({
      Id: permissionData?.Id,
      Status: permissionData?.Status,
      Title: permissionData?.Title,
    });
  }, [permissionData, reset]);

  return (
    <>
      <UserButton
        featureName={buttons.modify}
        isLoading={isPending}
        variant="outlined"
        startIcon={<ModeEditIcon />}
        onClick={handleOpen}
      >
        更新權限
      </UserButton>

      <Dialog
        isOpen={isOpen}
        size="xs"
        title="更新權限資料"
        onCancel={close}
        onConfirm={handleConfirm}
      >
        <Stack p={1} spacing={2}>
          <TextField
            size="small"
            label="權限名稱、說明"
            error={!!errors.Title}
            helperText={errors.Title?.message}
            {...register("Title")}
          />
          <TextField
            size="small"
            label="權限狀態"
            select
            defaultValue={permissionData?.Status}
            {...register("Status")}
          >
            <MenuItem value={1}>啟用</MenuItem>
            <MenuItem value={0}>停用</MenuItem>
          </TextField>
        </Stack>
      </Dialog>
    </>
  );
};
