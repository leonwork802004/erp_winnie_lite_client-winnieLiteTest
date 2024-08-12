import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { MenuItem, Stack, TextField, Tooltip } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { Dialog } from '@components/Elements';
import { UserButton } from "@features/userButton";
import { useDisclosure } from '@hooks/useDisclosure';
import { useUpdateBtn } from '../api/api';
import { sys001Keys } from '../api/queryKey';
import { GetPageBtnPayload, MenuTreeSchema, PageBtnSchema, UpdateBtnPayload, updateBtnPayload } from '../api/type';
import { buttons } from "../utils"

type Props = {
    selectedBtnItem: PageBtnSchema | null;
    selectedMenuItem: MenuTreeSchema | null;
    onSelectItemChange: (pageBtn: PageBtnSchema | null) => void;
    setRowSelectionModel: (value: React.SetStateAction<GridRowSelectionModel | undefined>) => void;
};

export const EditBtnDialog = ({
    selectedBtnItem,
    selectedMenuItem,
    onSelectItemChange,
    setRowSelectionModel
}: Props) => {
    const { editBtn } = buttons;
    const { isOpen, open, close } = useDisclosure();
    const queryClient = useQueryClient();

    //查詢目錄按鈕列表 參數
    const pageBtnPayload: GetPageBtnPayload = {
        pageId: selectedMenuItem?.PageId as number,
    }

    const defaultValues = {
        BtnId: selectedBtnItem?.Id ?? undefined,
        Title: selectedBtnItem?.Title ?? undefined,
        Status: selectedBtnItem?.Status ?? undefined,
    }

    const { mutate, isPending } = useUpdateBtn();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateBtnPayload>({
        defaultValues,
        resolver: zodResolver(updateBtnPayload),
    });

    //彈跳視窗取消
    const handleClose = () => { 
        close();
        reset(defaultValues);
    };

    //彈跳視窗確定
    const handleConfirm = () => {
        handleSubmit((param) => {
            mutate({
                BtnId: selectedBtnItem?.Id as number,
                Title: param.Title,
                Status: param.Status
            }, {
                onSuccess: () => {
                    toast.success("更新成功");
                    
                    //重新執行 查詢目錄按鈕列表
                    queryClient.invalidateQueries({
                        queryKey: sys001Keys.getPageBtn(pageBtnPayload),
                    });

                    onSelectItemChange(null);
                    setRowSelectionModel([]);

                    handleClose();
                },
                onError: (error: any) => {
                    const message =
                        error?.response?.data?.Msg || `更新失敗 ${error?.message}`;
                    toast.error(message);
                },
            });
        })();
    };

    const [status, setStatus] = useState<number>();

    useEffect(() => {
        reset({
            BtnId: selectedBtnItem?.Id ?? undefined,
            Title: selectedBtnItem?.Title ?? undefined,
            Status: selectedBtnItem?.Status ?? undefined,
        });
        setStatus(selectedBtnItem?.Status ?? 1);
    }, [selectedBtnItem, reset]);

    return (
        <>
            <Tooltip title={selectedBtnItem == null && "請選擇要編輯的按鈕"} placement="bottom-start" arrow>
                <span>
                    <UserButton
                        featureName={editBtn.featureName}
                        variant="outlined"
                        startIcon={<EditRoundedIcon />}
                        onClick={open}
                        disabled={selectedBtnItem == null}
                        isLoading={isPending}
                    >
                        {editBtn.label}
                    </UserButton>
                </span>
            </Tooltip>

            <Dialog
                isOpen={isOpen}
                title={`[編輯按鈕] ${selectedBtnItem?.Name}`}
                size="sm"
                sx={{ height: 600 }}
                onCancel={handleClose}
                onConfirm={handleConfirm}
            >
                <Stack mt={1} spacing={2}>
                    <TextField
                        label="按鈕標題"
                        size="small"
                        required
                        {...register("Title")}
                        error={!!errors.Title}
                        helperText={errors?.Title?.message}
                    />

                    <TextField
                        select
                        label="啟用狀態"
                        size="small"
                        value={status}
                        required
                        {...register("Status")}
                        onChange={(e) => {
                            setStatus(Number(e.target.value));
                        }}
                    >
                        <MenuItem value={1}>啟用</MenuItem>
                        <MenuItem value={0}>停用</MenuItem>
                    </TextField>
                </Stack>
            </Dialog >
        </>
    )
}