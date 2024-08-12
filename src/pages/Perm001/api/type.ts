import { z } from "zod";
import { baseResponse } from "@appTypes/baseResponse";

//#region 查詢角色關聯權限
const permissionDataSchema = z.object({
  Id: z.number(),
  Title: z.string(),
  Type: z.number(),
  Filter: z.number(),
  LinkId: z.number(),
  LinkName: z.string().optional(),
  LinkTitle: z.string().optional(),
  LinkStatus: z.number().optional(),
  Status: z.number(),
  Inherited: z.number(),
});
export type PermissionDataSchema = z.infer<typeof permissionDataSchema>;

export const fetchLinkPermissionsResponse = baseResponse.extend({
  Data: z.array(permissionDataSchema),
});
export type FetchLinkPermissionsResponse = z.infer<
  typeof fetchLinkPermissionsResponse
>;
//#endregion

//#region 移動角色樹狀圖節點
const moveTreesPayload = z.object({
  id: z.number(),
  toParent: z.number(),
});
export type MoveTreesPayload = z.infer<typeof moveTreesPayload>;

export const setRoleDataResponse = baseResponse.extend({
  Data: z.number(),
});
export type SetRoleDataResponse = z.infer<typeof setRoleDataResponse>;
//#endregion

//#region 新增角色
export const addRoleDataPayload = z.object({
  Name: z.string().min(1, { message: "請輸入角色識別名稱" }),
  Title: z.string().optional(),
  Status: z.number(),
  ToParent: z.number().optional(),
});
export type AddRoleDataPayload = z.infer<typeof addRoleDataPayload>;

export const addRoleDataResponse = baseResponse.extend({
  Data: z.object({
    ParentId: z.number(),
    Id: z.number(),
  }),
});
export type AddRoleDataResponse = z.infer<typeof addRoleDataResponse>;
//#endregion

//#region 修改角色
const updateRoleDataPayload = z.object({
  id: z.number(),
  Title: z.string(),
  Status: z.number().optional(),
});
export type UpdateRoleDataPayload = z.infer<typeof updateRoleDataPayload>;
//#endregion
