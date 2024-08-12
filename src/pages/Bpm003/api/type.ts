import { z } from "zod";
import { baseResponse } from "@appTypes/baseResponse";

//#region 查詢 Log 分頁資訊
export type FetchPageInfoPayload = {
    size?: number;
    synced?: number;
};

const pageInfoSchema = z.object({
    RowCount: z.number(),
    PageCount: z.number(),
    PageSize: z.number(),
});
export const pageInfoResponse = baseResponse.extend({ Data: pageInfoSchema });
export type PageInfoResponse = z.infer<typeof pageInfoResponse>;
//#endregion

//#region 查詢 Log 歷程 by分頁
export type FetchDataPayload = FetchPageInfoPayload & {
    page?: number;
};

const pageDataSchema = z.object({
    RowNum: z.number(),
    SyncId: z.number(),
    CreatedAt: z.string(),
    NumberOfDepartments: z.number(),
    NumberOfMembers: z.number(),
    GeneratedAt: z.string().optional(),
    SyncedAt: z.string().optional(),
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

//#region 查詢部門 Log 歷程 
export type FetchPageInfoBySyncIdPayload = {
    size?: number;
    syncId?: number;
};

export type FetchDataBySyncIdPayload = FetchPageInfoBySyncIdPayload & {
    page?: number;
};

const memSchema = z.object({
    MemId: z.string().optional(),
    EmpNo: z.string().optional(),
    RolId: z.string().optional(),
    Username: z.string().optional(),
});

const deptSchema = z.object({
    DepId: z.string().optional(),
    DepNo: z.string().optional(),
    DepName: z.string().optional(),
});

export const baseDeptLogSchema = z.object({
    SyncId: z.number().optional(),
    Type: z.number().optional(),
    RowNum: z.number().optional(),
    DepId: z.string().optional(),
    DepNo: z.string().optional(),
    DepName: z.string().optional(),
    Manager: memSchema.optional(),
    Parent: deptSchema.optional(),
});

export const rootDeptLogSchema = baseDeptLogSchema.extend({
    B4: baseDeptLogSchema.optional(),
});

export type RootDeptLogSchema = z.infer<typeof rootDeptLogSchema>;

const DeptPageRowsInfoSchema = z.object({
    PageSize: z.number(),
    Page: z.number(),
    Rows: z.array(rootDeptLogSchema),
});

export const deptPageRowsInfoResponse = baseResponse.extend({
    Data: DeptPageRowsInfoSchema,
});
export type DeptPageRowsInfoResponse = z.infer<typeof deptPageRowsInfoResponse>;
//#endregion

//#region 查詢人員 Log 歷程 
export const baseMemLogSchema = z.object({
    SyncId: z.number().optional(),
    Type: z.number().optional(),
    RowNum: z.number().optional(),
    MemId: z.string().optional(),
    EmpNo: z.string().optional(),
    RolId: z.string().optional(),
    Username: z.string().optional(),
    Department: deptSchema.optional(),
});

export const rootMemLogSchema = baseMemLogSchema.extend({
    B4: baseMemLogSchema.optional(),
});

export type RootMemLogSchema = z.infer<typeof rootMemLogSchema>;

const MemPageRowsInfoSchema = z.object({
    PageSize: z.number(),
    Page: z.number(),
    Rows: z.array(rootMemLogSchema),
});

export const MemPageRowsInfoResponse = baseResponse.extend({
    Data: MemPageRowsInfoSchema,
});
export type MemPageRowsInfoResponse = z.infer<typeof MemPageRowsInfoResponse>;
//#endregion

//#region 查詢組織同步模式
const syncModeSchema = z.object({
    Mode: z.string().optional(),
    Limit: z.number().optional(),
});

export type SyncModeSchema = z.infer<typeof syncModeSchema>;

export const syncModeResponse = baseResponse.extend({
    Data: syncModeSchema,
});
export type SyncModeResponse = z.infer<typeof syncModeResponse>;
//#endregion

//#region 設定組織同步模式
export const updateSyncModeDataPayload = z.object({
    Mode: z.string().optional(),
    Limit: z.preprocess(
        (value) => (value === "" ? NaN : Number(value)),
        z.union([
            z.number().min(5, { message: "限制數量最小值為 5" }),
            z.nan()
        ]).refine(val => !Number.isNaN(val), { message: "請輸入限制數量" })).optional()
});
export type UpdateSyncModeDataPayload = z.infer<typeof updateSyncModeDataPayload>;
//#endregion
