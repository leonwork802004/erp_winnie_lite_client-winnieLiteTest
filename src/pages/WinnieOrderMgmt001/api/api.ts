import { useMutation, useQuery } from "@tanstack/react-query";
import { BaseResponse, baseResponse } from "@appTypes/baseResponse";
import axios from "@lib/axios";
import { queryKeys } from "./queryKeys";
import {
  EnforceOrderPayload,
  GetModeMappingRes,
  GetOrderIdRes,
  OrderDispatchEndpoint,
  getDelInfosRes,
  getModeMappingRes,
  getOrderIdRes,
  getOrderInfosRes,
  getPickInfosRes,
  getPoolInfosRes,
  getProjectInfosRes,
  getStockInfosRes,
  getTrfInfosRes,
  getTrfModeRes,
} from "./type";

//#region 查詢訂單編號 by揀貨單號
const getOrderId = async (pickId: string): Promise<GetOrderIdRes> => {
  const { data } = await axios.get("OrderDispatch/OrderId", {
    params: { pickId },
  });
  return getOrderIdRes.parse(data);
};
export const useGetOrderId = (pickId: string) =>
  useQuery({
    queryKey: queryKeys.getOrderId(pickId),
    queryFn: () => getOrderId(pickId),
    enabled: !!pickId,
  });
//#endregion

//#region 查詢派單模式對照表
const getModeMapping = async (): Promise<GetModeMappingRes> => {
  const { data } = await axios.get("OrderDispatch/ModeMapping");
  return getModeMappingRes.parse(data);
};
export const useGetModeMapping = () =>
  useQuery({ queryKey: queryKeys.getModeMapping(), queryFn: getModeMapping });
//#endregion

//#region 查詢 table 相關資訊
const getOrderDispatchData = async (
  endpoint: OrderDispatchEndpoint,
  ordId: string
) => {
  const { data } = await axios.get(`OrderDispatch/${endpoint}`, {
    params: { ordId },
  });

  switch (endpoint) {
    // 查詢訂單資訊
    case "OrderInfos":
      return getOrderInfosRes.parse(data);
    // 查詢調撥模式
    case "TrfMode":
      return getTrfModeRes.parse(data);
    // 查詢撿貨資訊
    case "PickInfos":
      return getPickInfosRes.parse(data);
    // 查詢刪單資訊
    case "DelInfos":
      return getDelInfosRes.parse(data);
    // 查詢調撥單資訊
    case "TrfInfos":
      return getTrfInfosRes.parse(data);
    // 查詢商品庫存資訊
    case "StockInfos":
      return getStockInfosRes.parse(data);
    // 查詢工程資訊
    case "ProjectInfos":
      return getProjectInfosRes.parse(data);
    // 查詢派單 pool 資訊
    case "PoolInfos":
      return getPoolInfosRes.parse(data);
    default:
      return data;
  }
};
export const useGetOrderDispatchData = (
  endpoint: OrderDispatchEndpoint,
  ordId: string
) =>
  useQuery({
    queryKey: queryKeys.getOrderDispatchData(endpoint, ordId),
    queryFn: () => getOrderDispatchData(endpoint, ordId),
    enabled: !!ordId,
  });
//#endregion

//#region 派單
const executeOrder = async (ordId: string): Promise<BaseResponse> => {
  const { data } = await axios.post("OrderDispatch/Execute", null, {
    params: { ordId },
  });
  return baseResponse.parse(data);
};
export const useExecuteOrder = () => useMutation({ mutationFn: executeOrder });
//#endregion

//#region 強制派單
const enforceOrder = async ({
  dispatchId,
  mode,
  isDelete,
  isPick,
}: EnforceOrderPayload) => {
  const { data } = await axios.post(
    "OrderDispatch/Enforce",
    { Mode: mode, Delete: isDelete ? "1" : "0", Pick: isPick ? "1" : "0" },
    {
      params: { ordId: dispatchId },
    }
  );
  return baseResponse.parse(data);
};
export const useEnforceOrder = () => useMutation({ mutationFn: enforceOrder });
//#endregion
