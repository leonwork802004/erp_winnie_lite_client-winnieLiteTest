import { z } from "zod";
import { baseResponse } from "@appTypes/baseResponse";

//#region  查詢目錄
const baseMenuSchema = z.object({
    Id: z.number(),
    Title: z.string(),
    RootName: z.string().optional(),
    Priority: z.number(),
    Status: z.number(),
    PageId: z.number().optional(),
});

export type Menu = z.infer<typeof baseMenuSchema> & {
    children?: Menu[];
};
const menuTreeSchema: z.ZodType<Menu> = baseMenuSchema
    .extend({
        Children: z.lazy(() => z.array(menuTreeSchema)).optional(),
    })
    .transform(({ Children, ...data }) => ({ ...data, children: Children }));

export type MenuTreeSchema = z.infer<typeof menuTreeSchema>;
export const menuTreeResponse = baseResponse.extend({
    Data: z.array(menuTreeSchema)
});
export type MenuTreeResponse = z.infer<typeof menuTreeResponse>;
//#endregion

//#region  查詢頁面關聯按鈕
export type GetPageBtnPayload = {
    pageId: number;
    status?: number;
};

const pageBtnSchema = z.object({
    PageBtnId: z.number(),
    Id: z.number(),
    Name: z.string(),
    Title: z.string(),
    CreatedAt: z.string(),
    Status: z.number()
})

export type PageBtnSchema = z.infer<typeof pageBtnSchema>;
export const pageBtnResponse = baseResponse.extend({
    Data: z.array(pageBtnSchema).optional()
});
export type PageBtnResponse = z.infer<typeof pageBtnResponse>;
//#endregion

//#region 查詢目錄節點列表
const menuNodesSchema = z.object({
    Id: z.number(),
    Title: z.string(),
    Status: z.number()
})

export type MenuNodesSchema = z.infer<typeof menuNodesSchema>;
export const menuNodesResponse = baseResponse.extend({
    Data: z.array(menuNodesSchema).optional()
});
export type MenuNodesResponse = z.infer<typeof menuNodesResponse>;
//#endregion

//#region 查詢尚未關聯按鈕
const notRELBtnSchema = z.object({
    Id: z.number(),
    Name: z.string(),
    Title: z.string(),
    Status: z.number(),
    CreatedAt: z.string()
})

export type NotRELBtnSchema = z.infer<typeof notRELBtnSchema>;
export const notRELBtnSchemaResponse = baseResponse.extend({
    Data: z.array(notRELBtnSchema).optional()
});
export type NotRELBtnSchemaResponse = z.infer<typeof notRELBtnSchemaResponse>;
//#endregion

//#region 新增目錄節點
export const addMenuBranchPayload = z.object({
    Title: z.string().min(1, { message: "請輸入目錄標題" }),
    ParentId: z.number().optional(),
    Status: z.number(),
    Sort: z.number().optional(),
    RootName: z.string().optional(),
});
export type AddMenuBranchPayload = z.infer<typeof addMenuBranchPayload>;

export const addMenuBranchResponse = baseResponse.extend({
    Data: z.number().optional(),
});
export type AddMenuBranchResponse = z.infer<typeof addMenuBranchResponse>;
//#endregion

//#region 更新目錄節點
export const updateMenuBranchPayload = z.object({
    MenuBranchesId: z.number().min(1, "請輸入目錄節點 流水序"),
    Title: z.string().min(1, { message: "目錄標題不可為空" }).optional(),
    ParentId: z.number().optional(),
    Status: z.number().optional(),
    Sort: z.number().optional(),
    RootName: z.string().optional(),
})
export type UpdateMenuBranchPayload = z.infer<typeof updateMenuBranchPayload>;

export const updateMenuBranchResponse = baseResponse.extend({
    Data: z.number().optional(),
});
export type UpdateMenuBranchResponse = z.infer<typeof updateMenuBranchResponse>;
//#endregion

//#region 新增頁面
export const addPagePayload = z.object({
    Name: z.string().min(1, { message: "請輸入頁面關聯名稱" }),
    Title: z.string().min(1, { message: "請輸入頁面標題" }),
    ParentId: z.number().optional(),
    Status: z.number(),
})
export type AddPagePayload = z.infer<typeof addPagePayload>;

export const addPageResponse = baseResponse.extend({
    Data: z.object({
        MenuBranchesId: z.number().optional(),
        PageId: z.number().optional()
    }).optional(),
});
export type AddPageResponse = z.infer<typeof addPageResponse>;
//#endregion

//#region 更新頁面
export const updatePagePayload = z.object({
    PageId: z.number().min(1, "請輸入頁面 流水序"),
    Title: z.string().min(1, { message: "目錄標題不可為空" }).optional(),
    ParentId: z.number().optional(),
    Status: z.number().optional(),
})
export type UpdatePagePayload = z.infer<typeof updatePagePayload>;

export const updatePageResponse = baseResponse.extend({
    Data: z.object({
        MenuBranchesId: z.number().optional(),
        PageId: z.number().optional()
    }).optional(),
});
export type UpdatePageResponse = z.infer<typeof updatePageResponse>;
//#endregion

//#region 新增按鈕
export const addBtnPayload = z.object({
    Name: z.string().min(1, { message: "請輸入按鈕關聯名稱" }),
    Title: z.string().min(1, { message: "請輸入按鈕標題" }),
    Status: z.number(),
    PageId: z.number()
})
export type AddBtnPayload = z.infer<typeof addBtnPayload>;

export const addBtnResponse = baseResponse.extend({
    Data: z.object({
        BtnId: z.number().optional(),
        PageBtnId: z.number().optional()
    }).optional()
})
export type AddBtnResponse = z.infer<typeof addBtnResponse>;
//#endregion

//#region 更新按鈕
export const updateBtnPayload = z.object({
    BtnId: z.number().min(1, "請輸入按鈕 流水序"),
    Title: z.string().min(1, { message: "按鈕標題不可為空" }).optional(),
    Status: z.number().optional(),
})
export type UpdateBtnPayload = z.infer<typeof updateBtnPayload>;

export const updateBtnResponse = baseResponse.extend({
    Data: z.object({
        BtnId: z.number().optional()
    }).optional()
})
export type UpdateBtnResponse = z.infer<typeof updateBtnResponse>;
//#endregion

//#region 新增頁面關聯按鈕
export const addPageBtnPayload = z.object({
    PageId: z.number().min(1, "請輸入頁面 流水序"),
    BtnId: z.number().min(1, "請輸入按鈕 流水序")
})
export type AddPageBtnPayload = z.infer<typeof addPageBtnPayload>;

export const addPageBtnResponse = baseResponse.extend({
    Data: z.number().optional()
})
export type AddPageBtnResponse = z.infer<typeof addPageBtnResponse>;
//#endregion

//#region 移除頁面關聯按鈕
export const deletePageBtnPayload = z.object({
    PageBtnId: z.number().min(1, "請輸入頁面關聯按鈕表 流水序"),
})
export type DeletePageBtnPayload = z.infer<typeof deletePageBtnPayload>;
//#endregion



