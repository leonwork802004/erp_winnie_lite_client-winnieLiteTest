import { TableColumn } from "@components/Elements";
import { WinnieUserSchema } from "../api";

export const userColumns: TableColumn<WinnieUserSchema>[] = [
  { title: "修改密碼時間", field: "PwdModDtm", width: 170 },
  { title: "最後登入 IP", field: "LoginIp" },
  { title: "帳號", field: "Acct", width: 140 },
  { title: "姓名", field: "Name" },
  { title: "使用者編號", field: "Id", width: 140 },
  { title: "是否啟用", field: "Status" },
  { title: "部門編號", field: "DepNo" },
  { title: "群組編號", field: "CrewNo", width: 140 },
  { title: "員工編號", field: "EmpNo" },
  { title: "電子郵件", field: "Email", width: 170 },
  { title: "備註", field: "Memo", width: 170 },
  { title: "建檔人", field: "CreMan", width: 120 },
  { title: "建檔日期", field: "CreDtm", width: 170 },
  { title: "修改人", field: "ModMan", width: 120 },
  { title: "修改日期", field: "ModDtm", width: 170 },
];

export const buttons = {
  qry: { label: "查詢", featureName: "WinnieUsr001_Qry" },
  unlock3Times: {
    label: "解三次錯誤",
    featureName: "WinnieUsr001_Unlock3Times",
  },
  unlock15D: { label: "解15天停用", featureName: "WinnieUsr001_Unlock15D" },
  chgPwd: { label: "修改密碼", featureName: "WinnieUsr001_ChgPwd" },
};
