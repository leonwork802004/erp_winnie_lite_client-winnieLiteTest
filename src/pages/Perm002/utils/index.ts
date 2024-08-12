import { GridColDef } from "@mui/x-data-grid";
import { PermissionType } from "../api";

export const buttons = {
  qry: "Perm002_QryRoles",
  setRoles: "Perm002_SetRoles",
  delRoles: "Perm002_DelRoles",
  modify: "Perm002_Modify",
  addPerm: "Perm002_AddPerm",
};

const permissionTypeMap: { [key: number]: string } = {
  1: "按鈕權限",
  2: "畫面權限",
  3: "API 權限",
};

const statusMap: { [key: number]: string } = {
  0: "停用",
  1: "啟用",
};

export const columns: GridColDef<PermissionType.PageDataSchema>[] = [
  { headerName: "第幾筆", field: "RowNum" },
  { headerName: "權限名稱、說明", field: "Title", width: 280 },
  {
    headerName: "授權類型",
    field: "Type",
    valueGetter: (_, { Type }) => permissionTypeMap[Type] || Type,
  },
  {
    headerName: "權限狀態",
    field: "Status",
    valueGetter: (_, { Status }) => statusMap[Status] || Status,
  },
  { headerName: "關聯資料 識別名稱", field: "LinkName", width: 220 },
  { headerName: "關聯資料 說明", field: "LinkTitle", width: 200 },
  {
    headerName: "關聯資料 狀態",
    field: "LinkStatus",
    valueGetter: (_, { LinkStatus }) =>
      (LinkStatus && statusMap[LinkStatus]) || LinkStatus,
  },
];
