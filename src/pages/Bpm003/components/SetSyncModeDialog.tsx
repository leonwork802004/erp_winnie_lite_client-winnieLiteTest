import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { MenuItem, Stack, TextField } from "@mui/material";
import { Dialog } from "@components/Elements";
import { UserButton } from "@features/userButton";
import { useDisclosure } from "@hooks/useDisclosure";
import { UpdateSyncModeDataPayload, bpm003Keys, updateSyncModeDataPayload } from "../api";
import { useFetchData, useUpdateSyncModeData } from "../api/orgSyncMode";
import { buttons } from "../utils";

export const SetSyncModeDialog = () => {
    const { setSyncMode } = buttons;
    const { isOpen, open, close } = useDisclosure();

    const queryClient = useQueryClient();

    //查詢同步模式 為預設選項
    const { data: fetchData, isLoading } = useFetchData();
    const defaultValues = fetchData?.Data;
    const [mode, setMode] = useState('');

    useEffect(() => {
        if (defaultValues?.Mode) {
            setMode(defaultValues.Mode);
        }
    }, [defaultValues]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateSyncModeDataPayload>({
        defaultValues,
        resolver: zodResolver(updateSyncModeDataPayload),
    });

    const { mutate } = useUpdateSyncModeData();

    //彈跳視窗取消
    const handleClose = () => {
        close();
        reset(defaultValues);
        setMode(defaultValues?.Mode || '');
    };

    //彈跳視窗確定
    const handleConfirm = () => {
        handleSubmit((data) => {
            mutate(data, {
                onSuccess: async () => {
                    toast.success(`設定同步模式 成功`);

                    close();

                    queryClient.invalidateQueries({
                        queryKey: bpm003Keys.syncMode(),
                    });
                },
                onError: (error: any) => {
                    const message =
                        error?.response?.data?.Msg || `設定同步模式 失敗 : ${error?.message}`;
                    toast.error(message);
                },
            });
        })();
    };

    return (
        <>
            <UserButton
                featureName={setSyncMode.featureName}
                variant="outlined"
                onClick={open}
                startIcon={<SettingsOutlinedIcon />}
                isLoading={isLoading}
            >
                {setSyncMode.label}
            </UserButton>

            <Dialog
                isOpen={isOpen}
                title="設定同步模式"
                size="sm"
                onCancel={handleClose}
                onConfirm={handleConfirm}
                sx={{ height: 600 }}
            >
                <Stack mt={1} spacing={2}>
                    <TextField
                        select
                        label="同步模式"
                        size="small"
                        required
                        defaultValue={mode || ""}
                        value={mode || ""}
                        {...register("Mode")}
                        onChange={(e) => {
                            setMode(e.target.value)
                            reset(defaultValues)
                        }}
                    >
                        <MenuItem value="P">忽略檢查</MenuItem>
                        <MenuItem value="T">測試模式</MenuItem>
                        <MenuItem value="Y">允許忽略檢查一次</MenuItem>
                        <MenuItem value="N">限制數量</MenuItem>
                    </TextField>

                    {/* "Y" / "N" 限制數量為必填 */}
                    {(mode === "Y" || mode === "N") &&
                        <TextField
                            size="small"
                            label="限制數量"
                            type="number"
                            required
                            error={!!errors.Limit}
                            helperText={errors?.Limit?.message}
                            InputProps={{ inputProps: { min: 5 } }}
                            {...register("Limit", {
                                valueAsNumber: true,
                            })}
                        />
                    }
                </Stack>
            </Dialog>
        </>
    );
}