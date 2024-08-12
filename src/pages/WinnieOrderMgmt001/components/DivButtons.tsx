import { useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import toast from "react-hot-toast";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Stack } from "@mui/material";
import { UserButton } from "@features/userButton";
import {
  EnforceOrderPayload,
  queryKeys,
  useEnforceOrder,
  useExecuteOrder,
} from "../api";
import { buttons } from "../utils";

type MutateType = "Execute" | "Enforce";
type Props = {
  input: EnforceOrderPayload;
  onFailedInputChange: (value: string) => void;
};

export const DivButtons = memo(({ input, onFailedInputChange }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: executeOrder, isPending: isExecuting } =
    useExecuteOrder();
  const { mutateAsync: enforceOrder, isPending: isEnforcing } =
    useEnforceOrder();

  // 派單
  const handleMutateAsync = async (type: MutateType) => {
    const ordIdArray = input.dispatchId
      .split("\n")
      .filter((ordId) => ordId.trim());
    const errors: string[] = [];

    const mutatePromises = ordIdArray.map(async (ordId) => {
      try {
        if (type === "Execute") {
          await executeOrder(ordId);
        } else {
          await enforceOrder({ ...input, dispatchId: ordId });
        }
      } catch (e: any) {
        errors.push(`${ordId} ${e?.response?.data?.Msg || e?.message}\n`);
      }
    });

    await Promise.allSettled(mutatePromises);
    toast.success("執行完成!");
    queryClient.invalidateQueries({ queryKey: queryKeys.allRefetch });
    onFailedInputChange(errors.join(""));
  };

  const handleExecuteOrder = () => handleMutateAsync("Execute");
  const handleEnforceOrder = () => {
    if (!input.mode) {
      toast.error("請選擇派單模式");
      return;
    }
    handleMutateAsync("Enforce");
  };

  return (
    <Stack spacing={1} direction={"row"}>
      <UserButton
        isLoading={isExecuting}
        featureName={buttons.div}
        startIcon={<ShoppingCartIcon />}
        variant="outlined"
        onClick={handleExecuteOrder}
      >
        直接派單
      </UserButton>
      <UserButton
        isLoading={isEnforcing}
        featureName={buttons.enforceDiv}
        startIcon={<ShoppingCartIcon />}
        variant="outlined"
        onClick={handleEnforceOrder}
      >
        重整派單
      </UserButton>
    </Stack>
  );
});
