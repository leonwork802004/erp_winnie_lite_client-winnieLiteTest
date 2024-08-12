import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { isEqual } from "lodash-es";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid, Stack } from "@mui/material";
import { Item } from "@components/Elements";
import { UserButton } from "@features/userButton";
import { useSessionStorageState } from "@hooks/useSessionStorageState";
import {
  EnforceOrderPayload,
  GetDataPayload,
  GetOrderIdRes,
  queryKeys,
  useGetOrderId,
} from "./api";
import {
  DivButtons,
  DivInputField,
  InputFieldsMobile,
  OrderMgmtTable,
  QryInputField,
} from "./components";
import { buttons } from "./utils";

const defaultValue: GetDataPayload = {
  ordId: "",
  pickId: "",
};

const WinnieOrderMgmt001 = () => {
  const queryClient = useQueryClient();

  // 查詢參數
  const [qryInput, setQryInput] = useSessionStorageState(
    "qryInput",
    defaultValue
  );
  const [qryPayload, setQryPayload] = useSessionStorageState(
    "qryPayload",
    defaultValue
  );
  // 派單參數
  const [divInput, setDivInput] = useSessionStorageState<EnforceOrderPayload>(
    "divInput",
    {
      dispatchId: "",
      mode: "",
      isDelete: true,
      isPick: true,
    }
  );
  // 重派失敗訂編
  const [failedInput, setFailedInput] = useSessionStorageState<string>(
    "failedInput",
    ""
  );
  const handleQryInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQryInput({ ...qryInput, [e.target.name]: e.target.value });
    },
    [qryInput, setQryInput]
  );
  const handleDivInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setDivInput({ ...divInput, [e.target.name]: value });
    },
    [divInput, setDivInput]
  );
  const handleFailedInputChange = useCallback(
    (value: string) => {
      setFailedInput(value);
    },
    [setFailedInput]
  );

  // 查詢訂編
  const { data: orderIdRes, refetch } = useGetOrderId(qryPayload.pickId);
  const isFetching = useIsFetching({ queryKey: queryKeys.all });

  const handleOrdIdChange = useCallback(
    (res?: GetOrderIdRes) => {
      const ordId = res?.Data[0] || qryInput.ordId;
      setQryInput((prev) => ({ ...prev, ordId }));
      setQryPayload((prev) => ({ ...prev, ordId }));
    },
    [qryInput.ordId, setQryInput, setQryPayload]
  );

  // 查詢資料
  const handleGetOrderInfos = () => {
    if (!qryInput.ordId && !qryInput.pickId) {
      toast.error("請輸入訂單編號");
      return;
    }

    if (qryInput.ordId && !/^\d+$/.test(qryInput.ordId)) {
      toast.error("訂單編號有誤");
      return;
    }

    if (isEqual(qryInput, qryPayload) && qryPayload.ordId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.allRefetch });
    } else {
      if (qryInput.pickId && qryInput.pickId === qryPayload.pickId) {
        refetch().then((res) => {
          handleOrdIdChange(res.data);
        });
      }
      setQryPayload(qryInput);
    }
  };

  useEffect(() => {
    handleOrdIdChange(orderIdRes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderIdRes?.Data[0]]);

  return (
    <Grid
      container
      spacing={{ xs: 1, md: 2 }}
      p={2}
      direction={{ xs: "column", md: "row" }}
    >
      <Grid item md={2} xs="auto">
        <Item>
          <Box overflow={"auto"} height={{ md: "calc(100dvh - 96px)" }}>
            <Stack spacing={1}>
              <Stack
                spacing={{ xs: 1, md: 2 }}
                pt={1}
                direction={{ xs: "row", md: "column" }}
              >
                <QryInputField
                  input={qryInput}
                  onInputChange={handleQryInputChange}
                />
              </Stack>
              <Box display={{ xs: "none", md: "block" }}>
                <DivInputField
                  input={divInput}
                  onInputChange={handleDivInputChange}
                  failedInput={failedInput}
                  onFailedInputChange={handleFailedInputChange}
                />
              </Box>
            </Stack>
          </Box>
        </Item>
      </Grid>

      <Grid container item md xs direction={"column"}>
        <Grid item xs="auto">
          <Item sx={{ height: "auto" }}>
            <Stack direction={"row"} spacing={1}>
              <InputFieldsMobile
                input={divInput}
                onInputChange={handleDivInputChange}
                failedInput={failedInput}
                onFailedInputChange={handleFailedInputChange}
              />
              <UserButton
                isLoading={isFetching !== 0}
                featureName={buttons.qry}
                startIcon={<SearchIcon />}
                variant="outlined"
                onClick={handleGetOrderInfos}
              >
                查詢
              </UserButton>

              <Box display={{ xs: "none", md: "block" }}>
                <DivButtons
                  input={divInput}
                  onFailedInputChange={handleFailedInputChange}
                />
              </Box>
            </Stack>
          </Item>
        </Grid>

        <Grid container item xs pt={1}>
          <Item>
            <OrderMgmtTable ordId={qryPayload.ordId} />
          </Item>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WinnieOrderMgmt001;
