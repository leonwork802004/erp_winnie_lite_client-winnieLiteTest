import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { digitUppercase } from "@utils/digitUppercase";
import { memo } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import {
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { Dialog } from "@components/Elements";
import { UserButton } from "@features/userButton";
import { useDisclosure } from "@hooks/useDisclosure";
import {
  GetPCoinActDataPayload,
  modifyCoinLimitPayload,
  pCoinActKeys,
  useModifyCoinLimit,
} from "../api";
import { buttons } from "../utils";

type Props = {
  ActId?: string;
  SendLimlt?: number;
  IsSendLimlt?: string;
  ActStatus?: string;
  getDataPayload: GetPCoinActDataPayload;
};

const payload = modifyCoinLimitPayload.extend({
  // 原贈送點數限制
  originalSendLimit: z.number(),
  // 增額 / 減額
  status: z.string(),
  // 調整後點數限制
  adjustedSendLimit: z.string(),
});
type Payload = z.infer<typeof payload>;

const isActStatusValid = (status?: string) =>
  status && ["2", "3", "N", "-2"].includes(status);

const isSendLimitSet = (isSendLimlt?: string) =>
  isSendLimlt && isSendLimlt === "N";

export const ModifyDialog = memo(
  ({ ActId, SendLimlt, IsSendLimlt, ActStatus, getDataPayload }: Props) => {
    const queryClient = useQueryClient();
    const { isOpen, open, close } = useDisclosure();

    const {
      register,
      handleSubmit,
      reset,
      setValue,
      watch,
      formState: { errors },
      control,
      setError,
    } = useForm<Payload>({
      resolver: zodResolver(payload),
    });
    const { mutate, isPending } = useModifyCoinLimit();

    // 表單預設值
    const handleFormReset = () =>
      reset({
        id: ActId,
        q: "",
        originalSendLimit: SendLimlt,
        status: "+",
        adjustedSendLimit: " ",
      });

    // 開啟彈窗
    const handleOpen = () => {
      if (!ActId) {
        toast.error("請選擇要修改的資料");
        return;
      }

      if (isActStatusValid(ActStatus)) {
        toast.error(
          "活動已結束或刪除或審核不通過或未及時生效，無法調整活動贈送點數限制"
        );
        return;
      }

      if (isSendLimitSet(IsSendLimlt)) {
        toast.error("此筆活動未設定贈點上限");
        return;
      }

      handleFormReset();
      open();
    };

    // 計算調整後點數
    const handleSendLimitChange = () => {
      const status = watch("status");
      const q = Number(watch("q"));

      const changeAmount = status === "+" ? q : -q;
      const newSendLimit =
        !isNaN(q) && SendLimlt ? (SendLimlt + changeAmount).toString() : "";

      setValue("adjustedSendLimit", newSendLimit);
    };

    // 表單送出
    const handleConfirm = () => {
      handleSubmit(({ id, q, adjustedSendLimit, status }) => {
        if (Number(adjustedSendLimit) < 0) {
          setError("q", { message: "減額值不可大於原贈送點數限制值" });
          return;
        }
        mutate(
          { id: id, q: status + q },
          {
            onSuccess: (data) => {
              toast.success(data.Msg);

              queryClient.invalidateQueries({
                queryKey: pCoinActKeys.data(getDataPayload),
              });

              close();
            },
            onError: (error: any) => {
              const message =
                error?.response?.data?.Msg || `修改失敗 ${error?.message}`;
              toast.error(message);
            },
          }
        );
      })();
    };

    return (
      <>
        <UserButton
          featureName={buttons.modify}
          isLoading={isPending}
          endIcon={<SettingsSuggestIcon />}
          variant="outlined"
          onClick={handleOpen}
        >
          修改贈送點數限制
        </UserButton>

        <Dialog
          isOpen={isOpen}
          title="調整活動蹭送點數限制"
          size={"xs"}
          onCancel={close}
          onConfirm={handleConfirm}
        >
          <Stack spacing={2.5} pt={1}>
            <TextField
              fullWidth
              label="原贈送點數限制"
              size="small"
              disabled
              {...register("originalSendLimit")}
            />
            <FormControl>
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <RadioGroup
                    {...field}
                    defaultValue={"+"}
                    onChange={(e) => {
                      onChange(e.target.value);
                      handleSendLimitChange();
                    }}
                  >
                    <Stack direction={"row"}>
                      <FormControlLabel
                        value="+"
                        control={<Radio />}
                        label="增額"
                        sx={{
                          "& .MuiFormControlLabel-label": { color: blue[700] },
                        }}
                      />
                      <FormControlLabel
                        value="-"
                        control={<Radio />}
                        label="減額"
                        sx={{
                          "& .MuiFormControlLabel-label": { color: red[600] },
                        }}
                      />
                    </Stack>
                  </RadioGroup>
                )}
              ></Controller>
            </FormControl>

            <Box>
              <TextField
                fullWidth
                label="活動調整額度"
                size="small"
                {...register("q")}
                error={!!errors.q}
                helperText={errors.q?.message}
                onBlur={handleSendLimitChange}
              />
              <Typography variant="caption" color={"orange"}>
                {digitUppercase(Number(watch("q")))}
              </Typography>
            </Box>

            <Box>
              <TextField
                fullWidth
                label="調整後點數限制"
                size="small"
                disabled
                {...register("adjustedSendLimit")}
              />
              <Typography variant="caption" color={"orange"}>
                {digitUppercase(Number(watch("adjustedSendLimit")))}
              </Typography>
            </Box>
          </Stack>
        </Dialog>
      </>
    );
  }
);
