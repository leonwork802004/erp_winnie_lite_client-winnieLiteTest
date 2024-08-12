import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { MenuItem, Stack, TextField } from '@mui/material';
import { Dialog } from '@components/Elements';
import { UserButton } from "@features/userButton";
import { useDisclosure } from '@hooks/useDisclosure';
import { useAddBtn } from '../api/api';
import { sys001Keys } from '../api/queryKey';
import { AddBtnPayload, GetPageBtnPayload, MenuTreeSchema, addBtnPayload } from '../api/type';
import { buttons } from "../utils"

type Props = {
    selectedMenuItem: MenuTreeSchema | null;
};

export const AddBtnDialog = memo(({ selectedMenuItem: payload }: Props) => {
    const queryClient = useQueryClient();

    const { addBtn } = buttons;
    const { isOpen, open, close } = useDisclosure();

    //查詢目錄按鈕列表 參數
    const pageBtnPayload: GetPageBtnPayload = {
        pageId: payload?.PageId as number,
    }

    //新增按鈕
    const { mutate, isPending } = useAddBtn();
    const defaultValues = {
        Title: "",
        Status: 1,
        PageId: payload?.PageId as number,
        Name: "",
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AddBtnPayload>({
        defaultValues,
        resolver: zodResolver(addBtnPayload)
    });

    //彈跳視窗取消
    const handleClose = () => {
        close();
        reset(defaultValues);
    };

    //彈跳視窗確定
    const handleConfirm = () => {
        handleSubmit((param) => {
            mutate(
                {
                    Name: param.Name,
                    Title: param.Title,
                    Status: param.Status,
                    PageId: payload?.PageId as number,
                },
                {
                    onSuccess: () => {
                        toast.success("新增成功");

                        //重新執行 查詢目錄按鈕列表
                        queryClient.invalidateQueries({
                            queryKey: sys001Keys.getPageBtn(pageBtnPayload),
                        });

                        handleClose();
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
                featureName={addBtn.featureName}
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={open}
                isLoading={isPending}
            >
                {addBtn.label}
            </UserButton>

            <Dialog
                isOpen={isOpen}
                title="新增按鈕"
                size="sm"
                sx={{ height: 600 }}
                onCancel={handleClose}
                onConfirm={handleConfirm}
            >
                <Stack mt={1} spacing={2}>
                    <TextField
                        label="按鈕關聯名稱"
                        size="small"
                        required
                        {...register("Name")}
                        error={!!errors.Name}
                        helperText={errors.Name?.message}
                    />

                    <TextField
                        label="按鈕標題"
                        size="small"
                        required
                        {...register("Title")}
                        error={!!errors.Title}
                        helperText={errors.Title?.message}
                    />

                    <TextField
                        select
                        label="啟用狀態"
                        size="small"
                        defaultValue={1}
                        required
                        {...register("Status")}
                    >
                        <MenuItem value={1}>啟用</MenuItem>
                        <MenuItem value={0}>停用</MenuItem>
                    </TextField>
                </Stack>
            </Dialog>
        </>
    )
})

