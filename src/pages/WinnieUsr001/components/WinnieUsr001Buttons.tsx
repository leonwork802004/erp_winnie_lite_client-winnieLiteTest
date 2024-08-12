import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { every, isEmpty, isEqual } from "lodash-es";
import toast from "react-hot-toast";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockResetIcon from "@mui/icons-material/LockReset";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import { BaseResponse } from "@appTypes/baseResponse";
import { UserButton } from "@features/userButton";
import { useAlertDialogStore } from "@store/AlertDialog";
import {
  FetchWinnieUserPayload,
  FetchWinnieUserRes,
  WinnieUserSchema,
  unlockUserApi,
} from "../api";
import { buttons } from "../utils";

type WinnieUsr001ButtonsProps = {
  input: FetchWinnieUserPayload;
  userPayload: FetchWinnieUserPayload;
  selected: WinnieUserSchema | null;
  onUserPayloadChange: (data: FetchWinnieUserPayload) => void;
  onSelectedChange: (row: WinnieUserSchema | null) => void;
};

export const WinnieUsr001Buttons = ({
  input,
  userPayload,
  selected,
  onUserPayloadChange,
  onSelectedChange,
}: WinnieUsr001ButtonsProps) => {
  const queryClient = useQueryClient();
  const { showDialog } = useAlertDialogStore();
  const { qry, unlock3Times, unlock15D, chgPwd } = buttons;

  const { refetch, isFetching } = unlockUserApi.useFetchWinnieUser(userPayload);
  const unlockMutate = unlockUserApi.useUnlockWinnieUser();
  const unlock15DMutate = unlockUserApi.useUnlock15DWinnieUser();
  const resetPwdMutate = unlockUserApi.useResetPassword();

  //#region 查詢
  const handleFetchUser = () => {
    if (every(input, (value) => isEmpty(value?.trim()))) {
      toast.error("至少輸入一個查詢條件");
      return;
    }

    if (isEqual(input, userPayload)) {
      refetch();
    } else {
      onUserPayloadChange(input);
    }
    onSelectedChange(null);
  };
  //#endregion

  //#region mutate
  const handleAction = (
    mutateFn: UseMutationResult<BaseResponse, Error, string, unknown>,
    label: string
  ) => {
    if (!selected || !selected.Id) {
      toast.error("請選擇帳號");
      return;
    }

    showDialog({
      title: `確定執行 ${label}`,
      message: `對 ${selected?.Acct} 執行 ${label}`,
      action: () =>
        mutateFn.mutate(selected.Id, {
          onSuccess: (data) => {
            if (data.Code === "200") {
              toast.success(data.Msg);
            } else {
              toast.error(data.Msg);
            }

            queryClient.invalidateQueries({
              queryKey: ["winnieUser", { data: userPayload }],
            });

            const newData = queryClient.getQueryData<FetchWinnieUserRes>([
              "unlockUser",
              { data: userPayload },
            ]);
            const newSelected =
              (newData?.Data &&
                newData.Data.find((v) => v.Id === selected.Id)) ||
              null;
            onSelectedChange(newSelected);
          },
          onError: (error: any) => {
            const message =
              error?.response?.data?.Msg || `操作失敗 ${error?.message}`;
            toast.error(message);
          },
        }),
    });
  };
  //#endregion

  const renderUserButton = (
    featureName: string,
    label: string,
    mutateFn: UseMutationResult<BaseResponse, Error, string, unknown>,
    icon: JSX.Element
  ) => (
    <UserButton
      featureName={featureName}
      variant="outlined"
      endIcon={icon}
      onClick={() => handleAction(mutateFn, label)}
      isLoading={mutateFn.isPending}
    >
      {label}
    </UserButton>
  );

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, md: 2 }}
      useFlexGap
      flexWrap="wrap"
      height="100%"
      alignItems="center"
    >
      <UserButton
        featureName={qry.featureName}
        variant="outlined"
        startIcon={<SearchIcon />}
        onClick={handleFetchUser}
        isLoading={isFetching}
      >
        {qry.label}
      </UserButton>
      {renderUserButton(
        unlock3Times.featureName,
        unlock3Times.label,
        unlockMutate,
        <LockOpenIcon />
      )}
      {renderUserButton(
        unlock15D.featureName,
        unlock15D.label,
        unlock15DMutate,
        <LockOpenIcon />
      )}
      {renderUserButton(
        chgPwd.featureName,
        chgPwd.label,
        resetPwdMutate,
        <LockResetIcon />
      )}
    </Stack>
  );
};
