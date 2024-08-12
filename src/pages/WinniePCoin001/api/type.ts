import { formatDate } from "@utils/formatDate";
import { Dayjs } from "dayjs";
import { z } from "zod";
import { baseResponse } from "@appTypes/baseResponse";

//#region P 幣活動狀態 對照表
const actStatusMappingSchema = z.object({
  Key: z.string(),
  Display: z.string(),
});
export const getActStatusMappingResponse = baseResponse.extend({
  Data: z.array(actStatusMappingSchema),
});
export type GetActStatusMappingResponse = z.infer<
  typeof getActStatusMappingResponse
>;
//#endregion

//#region P 幣活動查詢
export type GetPCoinActDataPayload = {
  begin: Dayjs | null;
  end: Dayjs | null;
  status: string;
  id: string;
};

const pCoinDataSchema = z.object({
  // 活動 ID
  ActId: z.string(),
  // 活動名稱
  ActName: z.string(),
  // 活動起始日
  ActBeginDt: z.string().transform(formatDate),
  // 活動結束日
  ActEndDt: z.string().transform(formatDate),
  // 活動狀態
  ActStatus: z.string(),
  // 估算目前贈送總金額
  EstAmt: z.number(),
  // 估算目前贈送總筆數
  EstCnt: z.number(),
  // 實際贈送總金額
  AtlAmt: z.number(),
  // 實際贈送總筆數
  AtlCnt: z.number(),
  // 活動贈送點數限制 (NULL:不限制總贈點數)
  SendLimlt: z.number(),
  // 是否有設定贈點上限(N:沒設定; Y:有設定)
  IsSendLimlt: z.string(),
  // P 幣支付比例
  PaymentRatio: z.number(),
  // 費用支付對象 (1:廠商出; 2:公司出)
  FeePaymentName: z.string().optional(),
  // 預計業績成長
  SalesGrow: z.number(),
  // 支付金額
  PayAmount: z.number(),
  // 達成比例 %
  AchievingRate: z.number(),
  // 放行狀態
  StatusDetail: z.string().optional(),
  // 放行/退回原因
  IofMemo: z.string().optional(),
  // 組別
  DpmName: z.string().optional(),
  // 科長放行人
  ScCheck: z.string().optional(),
  // 處長放行人
  DgCheck: z.string().optional(),
  // 部長放行人
  MsCheck: z.string().optional(),
  // 部長放行時間
  MsCheckTime: z.string().optional().transform(formatDate),
});
export type PCoinDataSchema = z.infer<typeof pCoinDataSchema>;

export const getPCoinActDataResponse = baseResponse.extend({
  Data: z.array(pCoinDataSchema),
});
export type GetPCoinActDataResponse = z.infer<typeof getPCoinActDataResponse>;
//#endregion

//#region 修改贈送點數限制
export const modifyCoinLimitPayload = z.object({
  // 活動 id
  id: z.string(),
  // 增減額
  q: z
    .string()
    .min(1, { message: "請輸入調整額度" })
    .refine((value) => /^[0-9]\d*$/.test(value), {
      message: "請輸入整數數字",
    }),
});
export type ModifyCoinLimitPayload = z.infer<typeof modifyCoinLimitPayload>;
//#endregion

//#region 查詢放行人清單
export const getActReleasersResponse = baseResponse.extend({
  Data: z.array(z.string()),
});
export type GetActReleasersResponse = z.infer<typeof getActReleasersResponse>;
//#endregion

//#region 活動強制放行
export const releasePCoinActPayload = z.object({
  id: z.string(), //活動 ID
  helpReleaser: z.string().min(1, { message: "請選擇放行人" }), // 放行人
});
export type ReleasePCoinActPayload = z.infer<typeof releasePCoinActPayload>;
//#endregion
