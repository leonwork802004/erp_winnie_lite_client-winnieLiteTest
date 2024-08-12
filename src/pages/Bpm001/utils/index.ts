import { TableColumn } from "@components/Elements";
import { DepSchema } from "../api";

export const depColumns: TableColumn<DepSchema>[] = [
  { title: "部門代號", field: "DepId", width: 230 },
  { title: "部門編號(網家)", field: "DepNo" },
  { title: "部門名稱", field: "DepName", width: 350 },
  { title: "部門主管", field: "DepManagerUserName" },
  { title: "上層部門代號", field: "ParentDepId", width: 230 },
  { title: "上層部門編號(網家)", field: "ParentDepNo" },
  { title: "上層部門名稱", field: "ParentDepName", width: 350 },
  { title: "上層部門主管", field: "ParentManagerUserName" },
];

export const buttons = {
  qry: { label: "查詢", featureName: "Bpm001_QryDeps" },
};
