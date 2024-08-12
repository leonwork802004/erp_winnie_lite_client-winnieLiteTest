import { green, red } from "@mui/material/colors";

export const buttons = {
  addRole: "Perm001_AddRole",
  moveRole: "Perm001_MoveRole",
  modifyRole: "Perm001_ModifyRole",
};

export const TypesMap: { [key: number]: string } = {
  1: "按鈕權限",
  2: "畫面權限",
  3: "API 權限",
};

export const statusMap: { [key: number]: string } = {
  0: "停用",
  1: "啟用",
};

export type ChipConfig = {
  backgroundColor: string;
  content: string;
};

export const InheritedMap: {
  [key: number]: ChipConfig;
} = {
  0: { content: "否", backgroundColor: green[100] },
  1: { content: "是", backgroundColor: red[100] },
};

export const FilterMap: {
  [key: number]: ChipConfig;
} = {
  1: { content: "授權", backgroundColor: green[100] },
  2: { content: "拒絕存取", backgroundColor: red[100] },
};
