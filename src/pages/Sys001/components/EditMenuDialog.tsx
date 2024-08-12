import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { Autocomplete, Checkbox, FormControlLabel, Grid, MenuItem, Stack, TextField, Tooltip } from '@mui/material';
import { Dialog } from "@components/Elements";
import { UserButton } from '@features/userButton';
import { useDisclosure } from '@hooks/useDisclosure';
import { useGetMenuNodes, useUpdateMenuBranch, useUpdatePage } from '../api/api';
import { sys001Keys } from '../api/queryKey';
import { Menu, MenuTreeSchema, UpdateMenuBranchPayload, UpdatePagePayload, updateMenuBranchPayload, updatePagePayload } from '../api/type';
import { buttons } from '../utils';
import { Option } from ".";

type Props = {
    selectedMenuItem: MenuTreeSchema | null;
    parentId: number | undefined;
    handleSelectedMenuChange: (row: Menu | null) => void;
    handleSelectedItemChange: (row: string | null) => void;
};

export const EditMenuDialog = memo(({ selectedMenuItem, parentId, handleSelectedMenuChange, handleSelectedItemChange }: Props) => {
    const { editMenu } = buttons;
    const { isOpen, open, close } = useDisclosure();
    const queryClient = useQueryClient();

    //撈取上層目錄節點
    const { data: menuNodes, isLoading } = useGetMenuNodes();

    const [nodeOptions, setBtnOptions] = useState<Option[]>([]);
    useEffect(() => {
        const options = menuNodes?.Data?.map(node => ({
            id: node.Id,
            label: node.Title
        })).filter(node => node.id != selectedMenuItem?.Id) || [];
        //上層節點要排除自己
        setBtnOptions(options)

        //設定上層目錄
        const defaultOption = options.find(option => option.id === parentId) || null;
        setOption(defaultOption);
        //類型為目錄節點 0 / 頁面 1
        setType(selectedMenuItem?.PageId ? 1 : 0)
    }, [menuNodes?.Data, parentId, selectedMenuItem]);

    const [option, setOption] = useState<Option | null>(null);
    //處理 上層節點下拉選單
    const handleOptionChange = (_event: any, newValue: Option | null) => {
        setOption(newValue);
    };

    //是否為主節點 狀態
    const [mainNode, setMainNode] = useState(false);
    //是否為目錄節點 0 / 頁面 1 狀態
    const [type, setType] = useState<number>(0);

    //#region 更新目錄節點
    const { mutate, isPending } = useUpdateMenuBranch();

    const defaultValues = {
        MenuBranchesId: selectedMenuItem?.Id as number,
        Title: selectedMenuItem?.Title,
        Status: selectedMenuItem?.Status,
        ParentId: !mainNode ? option?.id : undefined,
        RootName: !mainNode ? "" : selectedMenuItem?.RootName,
        Sort: selectedMenuItem?.Priority,
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        getValues
    } = useForm<UpdateMenuBranchPayload>({
        defaultValues,
        resolver: zodResolver(updateMenuBranchPayload)
    });
    //#endregion

    //#region 更新頁面
    const { mutate: mutatePage, isPending: isPendingPage } = useUpdatePage();

    const pageDefaultValues = {
        PageId: selectedMenuItem?.PageId as number,
        Title: selectedMenuItem?.Title,
        Status: selectedMenuItem?.Status,
        ParentId: !mainNode ? option?.id : undefined,
    };

    const {
        register: pageRegister,
        handleSubmit: pageHandleSubmit,
        reset: pageReset,
        formState: { errors: pageErrors }
    } = useForm<UpdatePagePayload>({
        defaultValues: pageDefaultValues,
        resolver: zodResolver(updatePagePayload)
    });
    //#endregion

    //按下確認按鈕 狀態
    const [isConfirm, setIsConfirm] = useState(false);
    const [isCancel, setIsCancel] = useState(false);

    //清除表單狀態及參數
    const clear = () => {
        setOption(nodeOptions.find(option => option.id === parentId) || null);
        reset(defaultValues);
        pageReset(pageDefaultValues);
    }

    //彈跳視窗取消
    const handleClose = () => {
        close();
        clear();
        setIsCancel(true);
        setIsConfirm(false);
    };

    //彈跳視窗確定
    const handleConfirm = () => {
        setIsConfirm(true);
        const value = getValues();
        if (mainNode && !value.RootName) {
            return;
        }
        if (!mainNode && !option?.id) {
            return;
        }

        switch (type) {
            case 0:
                handleSubmit((param) => {
                    mutate(
                        {
                            MenuBranchesId: selectedMenuItem?.Id as number,
                            Title: param.Title,
                            Status: selectedMenuItem?.Status == param.Status ? undefined : param.Status,
                            ParentId: !mainNode ? option?.id : undefined,
                            RootName: !mainNode ? "" : param.RootName,
                            Sort: selectedMenuItem?.Priority == param.Sort ? param.Sort : undefined,
                        },
                        {
                            onSuccess: () => {
                                toast.success("更新成功");

                                handleSuccess();
                            },
                            onError: (error: any) => {
                                const message =
                                    error?.response?.data?.Msg || `更新失敗 ${error?.message}`;
                                toast.error(message);
                            },
                        }
                    );
                })();
                break;
            case 1:
                pageHandleSubmit((param) => {
                    mutatePage(
                        {
                            PageId: selectedMenuItem?.PageId as number,
                            Title: param.Title,
                            Status: param.Status,
                            ParentId: option!.id
                        },
                        {
                            onSuccess: () => {
                                toast.success("更新成功");

                                handleSuccess();
                            },
                            onError: (error: any) => {
                                const message =
                                    error?.response?.data?.Msg || `更新失敗 ${error?.message}`;
                                toast.error(message);
                            },
                        }
                    );
                })();
                break;
        }
    };

    //更新成功
    const handleSuccess = () => {
        queryClient.invalidateQueries({
            queryKey: sys001Keys.getMenuTree(),
        });
        queryClient.invalidateQueries({
            queryKey: sys001Keys.getMenuNodes(),
        });

        handleSelectedMenuChange(null);
        handleSelectedItemChange(null);
        handleClose();
    }

    useEffect(() => {
        reset({
            MenuBranchesId: selectedMenuItem?.Id,
            Title: selectedMenuItem?.Title,
            ParentId: parentId ?? undefined,
            Status: selectedMenuItem?.Status,
            RootName: selectedMenuItem?.RootName
        });

        //是否為主節點
        setMainNode(parentId ? false : true)
    }, [parentId, reset, selectedMenuItem, isCancel]);

    useEffect(() => {
        pageReset({
            PageId: selectedMenuItem?.PageId,
            Title: selectedMenuItem?.Title,
            ParentId: parentId ?? undefined,
            Status: selectedMenuItem?.Status,
        });
    }, [pageReset, parentId, selectedMenuItem]);

    return (
        <>
            <Tooltip title={selectedMenuItem?.Id == null && "請選擇要編輯的目錄"} placement="bottom-start" arrow>
                <span>
                    <UserButton
                        featureName={editMenu.featureName}
                        startIcon={<EditNoteRoundedIcon />}
                        variant="outlined"
                        onClick={open}
                        disabled={selectedMenuItem?.Id == null}
                        isLoading={isPending || isPendingPage}
                    >
                        {editMenu.label}
                    </UserButton>
                </span>
            </Tooltip>

            <Dialog
                title={`[編輯目錄] ${selectedMenuItem?.Title}`}
                size="sm"
                onCancel={handleClose}
                onConfirm={handleConfirm}
                sx={{ height: 600 }}
                isOpen={isOpen}
            >
                <Stack mt={1} spacing={2}>
                    <TextField
                        label="目錄標題"
                        size="small"
                        required
                        error={type == 0 ? !!errors.Title : !!pageErrors.Title}
                        helperText={type == 0 ? errors.Title?.message : pageErrors.Title?.message}
                        {...type == 0 ? { ...register("Title") } : { ...pageRegister("Title") }}
                    />

                    {type == 0 &&
                        <Grid sx={{ display: 'inline-flex', mt: 3 }}>
                            <FormControlLabel control={
                                <Checkbox
                                    checked={mainNode}
                                    onChange={(e) => {
                                        setMainNode(e.target.checked)
                                        setIsConfirm(false)
                                    }}
                                />
                            }
                                label="設定為主節點" />

                            <TextField
                                label="節點關聯名稱"
                                size="small"
                                sx={{ flex: 1 }}
                                required={mainNode}
                                error={mainNode && isConfirm && !errors.RootName}
                                helperText={mainNode && isConfirm && !errors.RootName ? "請輸入節點關聯名稱" : ""}
                                disabled={!mainNode}
                                {...register("RootName")}
                            />
                        </Grid>
                    }

                    <Autocomplete
                        options={nodeOptions}
                        getOptionLabel={(option) => option.label}
                        value={option}
                        size="small"
                        sx={{ mt: 3 }}
                        loading={isLoading}
                        disabled={type == 0 && mainNode}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="上層節點"
                                required
                                error={!mainNode && isConfirm && !option}
                                helperText={!mainNode && isConfirm && !option ? "請選擇上層節點" : ""} />
                        }
                        onChange={handleOptionChange}
                    />

                    <TextField
                        select
                        label="啟用狀態"
                        size="small"
                        defaultValue={selectedMenuItem?.Status}
                        required
                        {...type == 0 ? { ...register("Status") } : { ...pageRegister("Status") }}
                    >
                        <MenuItem value={1}>啟用</MenuItem>
                        <MenuItem value={0}>停用</MenuItem>
                    </TextField>
                </Stack>
            </Dialog >
        </>
    );
})