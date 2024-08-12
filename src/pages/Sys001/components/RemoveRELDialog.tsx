import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LinkOffRoundedIcon from '@mui/icons-material/LinkOffRounded';
import { Tooltip } from '@mui/material';
import { UserButton } from "@features/userButton";
import { useAlertDialogStore } from '@store/AlertDialog';
import { useDeletePageBtn } from '../api/api';
import { sys001Keys } from '../api/queryKey';
import { GetPageBtnPayload, MenuTreeSchema, PageBtnSchema } from '../api/type';
import { buttons } from "../utils"

type Props = {
    selectedBtnItem: PageBtnSchema | null;
    selectedMenuItem: MenuTreeSchema | null;
};

export const RemoveRELDialog = ({
    selectedBtnItem,
    selectedMenuItem
}: Props) => {
    const { removeBtn } = buttons;
    const { showDialog } = useAlertDialogStore();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useDeletePageBtn();

    //查詢目錄按鈕列表 參數
    const param: GetPageBtnPayload = {
        pageId: selectedMenuItem?.PageId as number,
    }

    const handleDialogOpen = () => {
        showDialog({
            title: "是否移除按鈕關聯?",
            message: `移除 ${selectedBtnItem?.Title} 頁面關聯`,
            action: handleConfirm,
        });
    };

    const handleConfirm = () => {
        mutate(
            { PageBtnId: selectedBtnItem?.PageBtnId as number },
            {
                onSuccess: async () => {
                    toast.success(`移除成功`);

                    //重新執行 查詢目錄按鈕列表
                    queryClient.invalidateQueries({
                        queryKey: sys001Keys.getPageBtn(param),
                    });
                    //重新執行 查詢未關聯按鈕
                    queryClient.invalidateQueries({
                        queryKey: sys001Keys.getNotRELBtns(),
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
        <Tooltip title={selectedBtnItem == null && "請選擇要移除的按鈕"} placement="bottom-start" arrow>
            <span>
                <UserButton
                    featureName={removeBtn.featureName}
                    variant="outlined"
                    startIcon={<LinkOffRoundedIcon />}
                    onClick={handleDialogOpen}
                    disabled={selectedBtnItem == null}
                    isLoading={isPending}
                >
                    {removeBtn.label}
                </UserButton>
            </span>
        </Tooltip>
    )
}

