import { createContext } from "react";

export const buttons = {
    addMenu: { label: "新增目錄", featureName: "Sys001_AddMenu" },
    editMenu: { label: "編輯目錄", featureName: "Sys001_EditMenu" },
    addBtn: { label: "新增按鈕", featureName: "Sys001_AddBtn" },
    editBtn: { label: "編輯按鈕", featureName: "Sys001_EditBtn" },
    removeBtn: { label: "移除關聯按鈕", featureName: "Sys001_RemoveBtn" },
    addREL: { label: "新增關聯按鈕", featureName: "Sys001_AddPageBtn" },
};

export const TreeItemContext = createContext<{
    menuId?: number[];
}>({ menuId: [] });

export const statusMap = [
    { key: 0, value: "停用" },
    { key: 1, value: "啟用" },
]