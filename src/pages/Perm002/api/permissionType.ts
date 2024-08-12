import { z } from "zod";
import { baseResponse } from "@appTypes/baseResponse";

//#region 查詢權限分頁資訊
export type FetchPageInfoPayload = {
  size?: number;
  status?: string;
  auth?: string;
};

const pageInfoSchema = z.object({
  RowCount: z.number(),
  PageCount: z.number(),
  PageSize: z.number(),
});
export const pageInfoResponse = baseResponse.extend({ Data: pageInfoSchema });
export type PageInfoResponse = z.infer<typeof pageInfoResponse>;
//#endregion

//#region 查詢權限 by 分頁
export type FetchDataPayload = FetchPageInfoPayload & {
  page?: number;
};

const pageDataSchema = z.object({
  RowNum: z.number(),
  Id: z.number(),
  Title: z.string(),
  Type: z.number(),
  LinkId: z.number(),
  LinkName: z.string().optional(),
  LinkTitle: z.string().optional(),
  LinkStatus: z.number().optional(),
  Status: z.number(),
});
export type PageDataSchema = z.infer<typeof pageDataSchema>;

const PageRowsInfoSchema = z.object({
  PageSize: z.number(),
  Page: z.number(),
  Rows: z.array(pageDataSchema),
});
export const pageRowsInfoResponse = baseResponse.extend({
  Data: PageRowsInfoSchema,
});
export type PageRowsInfoResponse = z.infer<typeof pageRowsInfoResponse>;
//#endregion

//#region 新增權限
export const addDataPayload = z.object({
  Auth: z.number(),
  LinkId: z
    .string()
    .min(1, { message: "關聯流水序號必填" })
    .refine((value) => /^[0-9-]+$/.test(value), {
      message: "關聯流水序號必須為數字",
    }),
  Status: z.number(),
  Title: z.string(),
});
export type AddDataPayload = z.infer<typeof addDataPayload>;

export const setDataResponse = baseResponse.extend({
  Data: z.object({ Id: z.number() }),
});
export type SetDataResponse = z.infer<typeof setDataResponse>;
//#endregion

//#region 修改權限
export const updateDataPayload = z.object({
  Id: z.number(),
  Status: z.number(),
  Title: z.string().min(1, { message: "請輸入權限名稱" }),
});
export type UpdateDataPayload = z.infer<typeof updateDataPayload>;

export const updateDataResponse = baseResponse.extend({ Data: z.number() });
export type UpdateDataResponse = z.infer<typeof updateDataResponse>;
//#endregion

//#region 查詢權限關聯角色
export const roleDataSchema = z.object({
  Id: z.number(),
  Name: z.string(),
  Title: z.string(),
  Status: z.number(),
  Inherited: z.number(),
  Filter: z.number(),
});
export type RoleDataSchema = z.infer<typeof roleDataSchema>;
export const roleDataResponse = baseResponse.extend({
  Data: z.array(roleDataSchema),
});
export type RoleDataResponse = z.infer<typeof roleDataResponse>;
//#endregion

//#region 授權角色權限
export type SetLinkRolesPayload = {
  id: number;
  roleId: number;
  filter?: number;
};
//#endregion
