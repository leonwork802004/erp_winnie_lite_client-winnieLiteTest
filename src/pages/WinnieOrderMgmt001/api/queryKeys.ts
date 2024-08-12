import { OrderDispatchEndpoint } from "./type";

export const queryKeys = {
  all: ["WinnieOrderMgmt001"] as const,
  allRefetch: ["WinnieOrderMgmt001", "orderDispatch"] as const,
  // 查詢訂單編號 by揀貨單號
  getOrderId: (filters: string) =>
    [...queryKeys.all, "orderId", filters] as const,
  // 查詢派單模式對照表
  getModeMapping: () => [...queryKeys.all, "modeMapping"] as const,
  // 查詢 table 相關資訊
  getOrderDispatchData: (endpoint: OrderDispatchEndpoint, filters: string) =>
    [...queryKeys.allRefetch, endpoint, filters] as const,
};
