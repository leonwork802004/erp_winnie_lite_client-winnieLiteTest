import { formatDate } from "@utils/formatDate";
import { z } from "zod";
import { baseResponse } from "@appTypes/baseResponse";

export type GetDataPayload = {
  // 訂單編號
  ordId: string;
  // 撿貨單號
  pickId: string;
};

export enum OrderDispatchEndpoint {
  OrderInfos = "OrderInfos",
  TrfMode = "TrfMode",
  PickInfos = "PickInfos",
  DelInfos = "DelInfos",
  TrfInfos = "TrfInfos",
  StockInfos = "StockInfos",
  ProjectInfos = "ProjectInfos",
  PoolInfos = "PoolInfos",
}

//#region 查詢訂單編號 by揀貨單號
export const getOrderIdRes = baseResponse.extend({
  Data: z.array(z.string()),
});
export type GetOrderIdRes = z.infer<typeof getOrderIdRes>;
//#endregion

//#region 查詢派單模式對照表
export const getModeMappingRes = baseResponse.extend({
  Data: z.array(z.object({ Key: z.string(), Display: z.string() })),
});
export type GetModeMappingRes = z.infer<typeof getModeMappingRes>;
//#endregion

//#region 查詢訂單資訊
const ordInfoSchema = z.object({
  // 商品預設庫別
  ItemWh: z.string().optional(),
  // 商品狀態
  ProdStatus: z.string().optional(),
  // 目前狀態
  CurStatus: z.string().optional(),
  // 訂單類型
  OrdType: z.string().optional(),
  // 訂單編號
  OrdId: z.string().optional(),
  // 訂單序號
  OrdNo: z.string().optional(),
  // 商品 ID
  ProdId: z.string().optional(),
  // 商品名稱
  ProdName: z.string().optional(),
  // 出貨庫別
  OrdWh: z.string().optional(),
  // 訂單未出量
  ShipQty: z.number().optional(),
  // 有效揀貨量
  PickQty: z.number().optional(),
  // 預購出貨日
  PreShipDt: z.string().optional().transform(formatDate),
  // 預購
  Executor: z.string().optional(),
  // 可賣好揀庫存
  SellQty: z.number().optional(),
  // 可賣不好揀庫存
  SellHighQty: z.number().optional(),
  // 訂購商品數量
  ProdQty: z.number().optional(),
  // 派單池溏數量
  Stk24Qty: z.number().optional(),
  // 調撥預購池溏數量
  ZmQty: z.number().optional(),
  // 寄倉
  HaveSup: z.string().optional(),
  // 出貨否
  ShipChk: z.string().optional(),
  // 指定出貨日
  SetShipDt: z.string().optional().transform(formatDate),
  // 約定日
  AgrDt: z.string().optional().transform(formatDate),
  // 出貨日
  ShipDt: z.string().optional().transform(formatDate),
  // 訂單狀態
  MainStatus: z.number().optional(),
  // 退貨狀態
  MainBakStatus: z.number().optional(),
  // 訂單明細狀態
  OrdStatus: z.number().optional(),
  // 退貨明細狀態
  OrdBakStatus: z.number().optional(),
  // 轉單時間
  TrfDtm: z.string().optional().transform(formatDate),
  // 派單狀態
  IsBook: z.string().optional(),
  // 重派狀態
  BookFail: z.string().optional(),
  // 訂單日期
  OrdDtm: z.string().optional().transform(formatDate),
});
export type OrdInfoSchema = z.infer<typeof ordInfoSchema>;
export const getOrderInfosRes = baseResponse.extend({
  Data: z.array(ordInfoSchema),
});
//#endregion

//#region 查詢調撥模式
const trfModeSchema = z.object({
  // 訂單編號
  OrdId: z.string().optional(),
  // 訂單序號
  OrdNo: z.string().optional(),
  // 來源庫
  Wh: z.string().optional(),
  // 需求庫
  OrdWh: z.string().optional(),
  // 商品 ID
  ProdId: z.string().optional(),
  // 商品需求數量
  ProdQty: z.number().optional(),
  // 完成數量
  ZmQty: z.number().optional(),
  // 調撥模式
  Mode: z.string().optional(),
  // 開始時間
  BeginDtm: z.string().optional().transform(formatDate),
  // 確認完成時間
  ChkDtm: z.string().optional().transform(formatDate),
});
export type TrfModeSchema = z.infer<typeof trfModeSchema>;
export const getTrfModeRes = baseResponse.extend({
  Data: z.array(trfModeSchema),
});
//#endregion

//#region 查詢撿貨資訊
const pickInfoSchema = z.object({
  // 訂單編號
  OrdId: z.string().optional(),
  // 訂單序號
  OrdNo: z.string().optional(),
  // 揀貨庫別
  PickWh: z.string().optional(),
  // 揀貨狀態
  PickStatus: z.string().optional(),
  // 集貨場
  PickGift: z.string().optional(),
  // 揀貨單號
  PickId: z.string().optional(),
  // 揀貨序號
  PickNo: z.string().optional(),
  // 揀貨數量
  PickQty: z.number().optional(),
  // 商品編號
  ProdId: z.string().optional(),
  // 商品名稱
  ProdName: z.string().optional(),
  // 建檔時間
  KeyinDtm: z.string().optional().transform(formatDate),
  // 印揀貨單時間
  PickDtm: z.string().optional().transform(formatDate),
  // 出庫時間
  OutDtm: z.string().optional().transform(formatDate),
  // CP
  Cp: z.string().optional(),
  // CP時間
  CpDtm: z.string().optional().transform(formatDate),
});
export type PickInfoSchema = z.infer<typeof pickInfoSchema>;
export const getPickInfosRes = baseResponse.extend({
  Data: z.array(pickInfoSchema),
});
//#endregion

//#region 查詢刪單資訊
const delInfoSchema = z.object({
  // 刪單原因
  Mark: z.string().optional(),
  // 訂單編號
  OrdId: z.string().optional(),
  // 訂單序號
  OrdNo: z.string().optional(),
  // 揀貨庫別
  PickWh: z.string().optional(),
  // 揀貨狀態
  PickStatus: z.string().optional(),
  // 集貨場
  PickGift: z.string().optional(),
  // 揀貨單號
  PickId: z.string().optional(),
  // 揀貨序號
  PickNo: z.string().optional(),
  // 揀貨數量
  PickQty: z.number().optional(),
  // 商品 ID
  ProdId: z.string().optional(),
  // 商品名稱
  ProdName: z.string().optional(),
  // 建檔時間
  KeyinDtm: z.string().optional().transform(formatDate),
  // 印揀貨單時間
  PickDtm: z.string().optional().transform(formatDate),
  // 出庫時間
  OutDtm: z.string().optional().transform(formatDate),
  // CP
  Cp: z.string().optional(),
  // CP 時間
  CpDtm: z.string().optional().transform(formatDate),
});
export type DelInfoSchema = z.infer<typeof delInfoSchema>;
export const getDelInfosRes = baseResponse.extend({
  Data: z.array(delInfoSchema),
});
//#endregion

//#region 查詢調撥單資訊
const trfInfoSchema = z.object({
  // 調撥單號
  TrfId: z.string().optional(),
  // 訂單編號
  OrdId: z.string().optional(),
  // 來源庫
  Wh: z.string().optional(),
  // 調到這庫
  DstWh: z.string().optional(),
  // 調撥狀態
  Status: z.string().optional(),
  // 商品 ID
  ProdId: z.string().optional(),
  // 商品名稱
  ProdName: z.string().optional(),
  // 申請數量
  AdvQty: z.number().optional(),
  // 調撥上架數量
  InQty: z.number().optional(),
  // 調撥開始時間
  ActDtm: z.string().optional().transform(formatDate),
  // 調撥上架時間
  InDtm: z.string().optional().transform(formatDate),
  // 調撥完成時間
  DoneDtm: z.string().optional().transform(formatDate),
  // 調撥完成原因
  DoneCause: z.string().optional(),
});
export type TrfInfoSchema = z.infer<typeof trfInfoSchema>;
export const getTrfInfosRes = baseResponse.extend({
  Data: z.array(trfInfoSchema),
});
//#endregion

//#region 查詢商品庫存資訊
const stockInfoSchema = z.object({
  // 庫別
  Wh: z.string().optional(),
  // 庫別名稱
  WhName: z.string().optional(),
  // 商品 ID
  ProdId: z.string().optional(),
  // 商品名稱
  ProdName: z.string().optional(),
  // 訂單需求數量 (訂單數量-已出貨數量-取消數量)
  NeedQty: z.number().optional(),
  // 實際庫存(好撿)
  StockQty: z.number().optional(),
  // 實際庫存(高棧板)
  StockHighQty: z.number().optional(),
  // 可派庫存(好撿)
  Qty: z.number().optional(),
  // 可派庫存(高棧板)
  HighQty: z.number().optional(),
});
export type StockInfoSchema = z.infer<typeof stockInfoSchema>;
export const getStockInfosRes = baseResponse.extend({
  Data: z.array(stockInfoSchema),
});
//#endregion

//#region 查詢工程資訊
const projectInfoSchema = z.object({
  // 訂單編號
  OrdId: z.string().optional(),
  // 紀錄時間
  ModDtm: z.string().optional().transform(formatDate),
  // 備註 1
  Memo1: z.string().optional(),
  // 備註 2
  Memo2: z.string().optional(),
  // 備註 3
  Memo3: z.string().optional(),
});
export type ProjectInfoSchema = z.infer<typeof projectInfoSchema>;
export const getProjectInfosRes = baseResponse.extend({
  Data: z.array(projectInfoSchema),
});
//#endregion

//#region 查詢派單 pool 資訊
const poolInfoSchema = z.object({
  // 訂單編號
  OrdId: z.string().optional(),
  // 訂單序號
  OrdNo: z.string().optional(),
  // 商品 ID
  ProdId: z.string().optional(),
  // 庫別
  Wh: z.string().optional(),
  // 派單數量
  Qty: z.number().optional(),
  // 待出貨狀態
  TrfStatus: z.string().optional(),
  // 出貨狀態
  ShipStatus: z.string().optional(),
  // 建檔時間
  CreDtm: z.string().optional().transform(formatDate),
});
export type PoolInfoSchema = z.infer<typeof poolInfoSchema>;
export const getPoolInfosRes = baseResponse.extend({
  Data: z.array(poolInfoSchema),
});
//#endregion

//#region 強制派單
export type EnforceOrderPayload = {
  dispatchId: string;
  mode: string;
  isDelete: boolean;
  isPick: boolean;
};
//#endregion
