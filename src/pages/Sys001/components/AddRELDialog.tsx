import { useQueryClient } from '@tanstack/react-query';
import { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AddLinkRoundedIcon from '@mui/icons-material/AddLinkRounded';
import { Autocomplete, Stack, TextField } from '@mui/material';
import { Dialog } from '@components/Elements';
import { UserButton } from "@features/userButton";
import { useDisclosure } from '@hooks/useDisclosure';
import { useAddPageBtn, useGetNotRELBtns } from '../api/api';
import { sys001Keys } from '../api/queryKey';
import { AddPageBtnPayload, GetPageBtnPayload, MenuTreeSchema } from '../api/type';
import { buttons } from "../utils"

type Props = {
    selectedMenuItem: MenuTreeSchema | null;
};
export type Option = { id: number; label: string };

export const AddRELDialog = memo(({ selectedMenuItem }: Props) => {
    //查詢未關聯按鈕
    const { data: btnList, isLoading } = useGetNotRELBtns();

    //將Data轉換
    const [btnId, setBtnId] = useState<number | null>();
    const [btnOptions, setBtnOptions] = useState<Option[]>([]);
    useEffect(() => {
        const options = btnList?.Data?.map(btn => ({
            id: btn.Id,
            label: `${btn.Title} (${btn.Name})`
        })) || [];
        setBtnOptions(options);
    }, [btnList]);

    const { addREL } = buttons;
    const { isOpen, open, close } = useDisclosure();

    const queryClient = useQueryClient();

    //查詢目錄按鈕列表 參數
    const pageBtnPayload: GetPageBtnPayload = {
        pageId: selectedMenuItem?.PageId as number,
    }

    const [isConfirm, setIsConfirm] = useState(false);

    const handleOptionChange = (_event: any, newValue: Option | null) => {
        setBtnId(newValue?.id);
    };

    //彈跳視窗取消
    const handleClose = () => {
        close();
        setIsConfirm(false);
        setBtnId(null);
    };

    //彈跳視窗確定 新增關聯
    const { mutate, isPending } = useAddPageBtn();
    const {
        handleSubmit,
        formState: { errors }
    } = useForm<AddPageBtnPayload>();

    const handleConfirm = () => {
        setIsConfirm(true);
        if (!btnId) {
            return;
        }

        handleSubmit(() => {
            mutate(
                {
                    PageId: selectedMenuItem?.PageId as number,
                    BtnId: btnId as number
                },
                {
                    onSuccess: () => {
                        toast.success("新增成功");

                        //重新執行 查詢目錄按鈕列表
                        queryClient.invalidateQueries({
                            queryKey: sys001Keys.getPageBtn(pageBtnPayload),
                        });
                        //重新執行 查詢未關聯按鈕
                        queryClient.invalidateQueries({
                            queryKey: sys001Keys.getNotRELBtns(),
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
    }

    return (
        <>
            <UserButton
                featureName={addREL.featureName}
                variant="contained"
                startIcon={<AddLinkRoundedIcon />}
                isLoading={isPending}
                onClick={open}
            >
                {addREL.label}
            </UserButton>

            <Dialog
                isOpen={isOpen}
                title="新增關聯按鈕"
                size="sm"
                sx={{ height: 600 }}
                onCancel={handleClose}
                onConfirm={handleConfirm}
            >
                <Stack mt={1} spacing={2}>
                    <Autocomplete
                        options={btnOptions}
                        getOptionLabel={(option) => option.label}
                        value={btnOptions.find(option => option.id === btnId) || null}
                        size="small"
                        loading={isLoading}
                        onChange={handleOptionChange}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="按鈕標題"
                                required
                                error={isConfirm && !errors.BtnId}
                                helperText={isConfirm && !btnId ? "請選擇欲新增的關聯按鈕" : ""}
                            />
                        }
                    />
                </Stack>
            </Dialog>
        </>
    )
})
