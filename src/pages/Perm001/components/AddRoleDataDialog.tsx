import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Dialog } from "@components/Elements";
import { UserButton } from "@features/userButton";
import { useDisclosure } from "@hooks/useDisclosure";
import { AddRoleDataPayload, addRoleDataPayload, useAddRoleData } from "../api";
import { buttons } from "../utils";
import { RoleAutocomplete, RoleOption } from ".";

const defaultValues = {
  Title: "",
  Name: "",
  Status: 1,
};

export const AddRoleDataDialog = memo(() => {
  const queryClient = useQueryClient();
  const { isOpen, open, close } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddRoleDataPayload>({
    defaultValues,
    resolver: zodResolver(addRoleDataPayload),
  });

  const { mutate, isPending } = useAddRoleData();

  const [option, setOption] = useState<RoleOption | null>(null);
  const handleOptionChange = (_event: any, newValue: RoleOption | null) => {
    setOption(newValue);
  };

  const handleClose = () => {
    reset(defaultValues);
    setOption(null);
    close();
  };

  const handleConfirm = () => {
    handleSubmit((data) => {
      mutate(
        { ...data, ToParent: option?.id },
        {
          onSuccess: async (data) => {
            toast.success(
              `${data.Msg} 上層流水序號:${data.Data.ParentId} 角色流水序號:${data.Data.Id}`
            );

            handleClose();

            queryClient.invalidateQueries({
              queryKey: ["role", "trees"],
            });
          },
          onError: (error: any) => {
            const message =
              error?.response?.data?.Msg || `新增失敗 ${error?.message}`;
            toast.error(message);
          },
        }
      );
    })();
  };

  return (
    <>
      <UserButton
        featureName={buttons.addRole}
        isLoading={isPending}
        variant="outlined"
        startIcon={<PersonAddIcon />}
        onClick={open}
      >
        新增角色
      </UserButton>

      <Dialog
        isOpen={isOpen}
        title="新增角色"
        size="sm"
        onCancel={handleClose}
        onConfirm={handleConfirm}
        sx={{ height: 600 }}
      >
        <Stack mt={1} spacing={2}>
          <TextField
            size="small"
            label="角色識別名稱"
            required
            {...register("Name")}
            error={!!errors.Name}
            helperText={errors.Name?.message}
          />

          <TextField size="small" label="角色說明" {...register("Title")} />

          <TextField
            size="small"
            label="權限狀態"
            select
            defaultValue={1}
            required
            {...register("Status")}
          >
            <MenuItem value={1}>啟用</MenuItem>
            <MenuItem value={0}>停用</MenuItem>
          </TextField>

          <RoleAutocomplete
            option={option}
            onOptionChange={handleOptionChange}
            label="移動至(未填為未分類)"
          />
        </Stack>
      </Dialog>
    </>
  );
});
