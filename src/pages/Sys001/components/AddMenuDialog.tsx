import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { memo, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import { Autocomplete, Checkbox, FormControlLabel, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { Dialog } from "@components/Elements";
import { UserButton } from '@features/userButton';
import { useDisclosure } from '@hooks/useDisclosure';
import { useAddMenuBranch, useAddPage, useGetMenuNodes } from '../api/api';
import { sys001Keys } from '../api/queryKey';
import { AddMenuBranchPayload, AddPagePayload, MenuTreeSchema, addMenuBranchPayload, addPagePayload } from '../api/type';
import { buttons } from '../utils';
import { Option } from ".";

type Props = {
    selectedMenuItem: MenuTreeSchema | null;
};

export const AddMenuDialog = memo(({ selectedMenuItem }: Props) => {
    const { addMenu } = buttons;
    const { isOpen, open, close } = useDisclosure();
    const queryClient = useQueryClient();

    //撈取上層目錄節點
    const { data: menuNodes, isLoading } = useGetMenuNodes();
    const [type, setType] = useState<number>(0);

    const [nodeOptions, setBtnOptions] = useState<Option[]>([]);
    useEffect(() => {
        const options = menuNodes?.Data?.map(node => ({
            id: node.Id,
            label: node.Title
        })) || [];
        setBtnOptions(options)
        const defaultOption = options.find(option => option.id === selectedMenuItem?.Id) || null;
        setOption(defaultOption);
    }, [menuNodes?.Data, selectedMenuItem?.Id, type]);

    const [option, setOption] = useState<Option | null>(null);
    const handleOptionChange = (_event: any, newValue: Option | null) => {
        setOption(newValue);
    };

    const [mainNode, setMainNode] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const { mutate, isPending } = useAddMenuBranch();
    const { mutate: mutatePage, isPending: isPendingPage } = useAddPage();

    //#region 新增目錄節點
    const defaultValues = {
        Title: "",
        Status: 1,
        ParentId: !mainNode ? option?.id : undefined,
        RootName: "",
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        getValues
    } = useForm<AddMenuBranchPayload>({
        defaultValues,
        resolver: zodResolver(addMenuBranchPayload)
    });
    //#endregion

    //#region 新增頁面
    const pageDefaultValues = {
        Title: "",
        Status: 1,
        ParentId: option?.id,
        Name: "",
    }

    const {
        register: pageRegister,
        handleSubmit: pageHandleSubmit,
        reset: pageReset,
        formState: { errors: pageErrors }
    } = useForm<AddPagePayload>({
        defaultValues: pageDefaultValues,
        resolver: zodResolver(addPagePayload)
    });
    //#endregion

    //清除表單狀態及參數
    const clear = () => {
        setMainNode(false);
        setType(0);

        const defaultOption = nodeOptions.find(option => option.id === selectedMenuItem?.Id) || null;
        setOption(defaultOption);

        setIsConfirm(false);
        reset(defaultValues);
        pageReset(pageDefaultValues)
    }

    const handleSuccess = () => {
        queryClient.invalidateQueries({
            queryKey: sys001Keys.getMenuTree(),
        });
        queryClient.invalidateQueries({
            queryKey: sys001Keys.getMenuNodes(),
        });

        handleClose();
    }

    //彈跳視窗取消
    const handleClose = () => {
        close();
        clear();
    }

    //彈跳視窗確定
    const handleConfirm = () => {
        setIsConfirm(true);
        handleSubmit((param) => {
            //未設定為主節點 上層節點未選
            if (!mainNode && !option) {
                return;
            }
            //設定為主節點 節點關聯名稱未填寫
            if (mainNode && !getValues().RootName) {
                return;
            }

            mutate(
                {
                    Title: param.Title,
                    Status: param.Status,
                    ParentId: !mainNode ? option?.id : undefined,
                    RootName: mainNode ? param.RootName : undefined,
                    Sort: undefined,
                },
                {
                    onSuccess: () => {
                        toast.success("新增成功");

                        handleSuccess();
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

    const pageHandleConfirm = () => {
        setIsConfirm(true);
        pageHandleSubmit((param) => {
            //上層節點未選
            if (!option) {
                return;
            }
            mutatePage(
                {
                    Title: param.Title,
                    Status: param.Status,
                    ParentId: option!.id,
                    Name: param.Name
                },
                {
                    onSuccess: () => {
                        toast.success("新增成功");

                        handleSuccess();
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
                featureName={addMenu.featureName}
                startIcon={<PlaylistAddRoundedIcon />}
                variant="contained"
                onClick={open}
                isLoading={isPending || isPendingPage}
            >
                {addMenu.label}
            </UserButton>

            <Dialog
                title="新增目錄"
                size="sm"
                onCancel={handleClose}
                onConfirm={type == 0 ? handleConfirm : pageHandleConfirm}
                sx={{ height: 600 }}
                isOpen={isOpen}
            >
                {type == 0 &&
                    <Stack mt={1} spacing={2}>
                        <TextField
                            select
                            label="新增類型"
                            size="small"
                            defaultValue={0}
                            required
                            onChange={(e) => {
                                setType(Number(e.target.value));
                                setMainNode(false);
                                setIsConfirm(false);
                            }}
                        >
                            <MenuItem value="0">目錄節點</MenuItem>
                            <MenuItem value="1">頁面</MenuItem>
                        </TextField>

                        <TextField
                            label="目錄標題"
                            size="small"
                            required
                            error={!!errors.Title}
                            helperText={errors.Title?.message}
                            {...register("Title")}
                        />

                        <Grid sx={{ display: 'inline-flex', mt: 3 }}>
                            <FormControlLabel control={
                                <Checkbox
                                    onChange={(e) => {
                                        setMainNode(e.target.checked)
                                        setOption(null)
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
                                error={mainNode && isConfirm && !getValues().RootName}
                                helperText={mainNode && isConfirm && !getValues().RootName ? "請輸入節點關聯名稱" : ""}
                                disabled={!mainNode}
                                {...register("RootName")}
                            />


                        </Grid>

                        <Autocomplete
                            options={nodeOptions}
                            sx={{ mt: 3 }}
                            value={option}
                            size="small"
                            loading={isLoading}
                            disabled={mainNode}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="上層節點"
                                    required
                                    error={!mainNode && isConfirm && !option}
                                    helperText={!mainNode && isConfirm && !option ? "請選擇上層節點" : ""}
                                />
                            }
                            onChange={handleOptionChange}
                        />

                        <TextField
                            select
                            label="啟用狀態"
                            size="small"
                            required
                            defaultValue={1}
                            {...register("Status")}
                        >
                            <MenuItem value={1}>啟用</MenuItem>
                            <MenuItem value={0}>停用</MenuItem>
                        </TextField>
                    </Stack>
                }

                {type == 1 &&
                    <Stack mt={1} spacing={2}>
                        <TextField
                            select
                            label="新增類型"
                            size="small"
                            defaultValue={1}
                            required
                            onChange={(e) => {
                                setType(Number(e.target.value));
                                setMainNode(false);
                                setIsConfirm(false);
                            }}
                        >
                            <MenuItem value={0}>目錄節點</MenuItem>
                            <MenuItem value={1}>頁面</MenuItem>
                        </TextField>

                        <TextField
                            label="頁面關聯名稱"
                            size="small"
                            required
                            {...pageRegister("Name")}
                            error={!!pageErrors.Name}
                            helperText={pageErrors.Name?.message}
                        />

                        <TextField
                            label="目錄標題"
                            size="small"
                            required
                            {...pageRegister("Title")}
                            error={!!pageErrors.Title}
                            helperText={pageErrors.Title?.message}
                        />

                        <Autocomplete
                            options={nodeOptions}
                            getOptionLabel={(option) => option.label}
                            sx={{ mt: 3 }}
                            value={option}
                            size="small"
                            loading={isLoading}
                            disabled={mainNode}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="上層節點"
                                    required
                                    error={isConfirm && !option}
                                    helperText={isConfirm && !option ? "請選擇上層節點" : ""}
                                />
                            }
                            onChange={handleOptionChange}
                        />

                        <TextField
                            select
                            label="啟用狀態"
                            size="small"
                            required
                            defaultValue={1}
                            {...pageRegister("Status")}
                        >
                            <MenuItem value={1}>啟用</MenuItem>
                            <MenuItem value={0}>停用</MenuItem>
                        </TextField>
                    </Stack>
                }
            </Dialog>
        </>
    );
})