import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const menuList = [
  { featureName: "Wcf001", component: "Wcf001" },
  { featureName: "WinnieUsr001", component: "WinnieUsr001" },
  { featureName: "WinniePCoin001", component: "WinniePCoin001" },
  { featureName: "WinnieOrderMgmt001", component: "WinnieOrderMgmt001" },
  { featureName: "WinnieTyp", component: "WinnieTyp" },
  { featureName: "Perm001", component: "Perm001" },
  { featureName: "Perm002", component: "Perm002" },
  { featureName: "Bpm001", component: "Bpm001" },
  { featureName: "Bpm002", component: "Bpm002" },
  { featureName: "Bpm003", component: "Bpm003" },
  { featureName: "Sys001", component: "Sys001" },
];

export const protectedRoutes: RouteObject[] = [
  { index: true, Component: lazy(() => import("../pages/Home/index.tsx")) },
  ...menuList.map(({ featureName, component }) => ({
    path: featureName,
    Component: lazy(() => import(`../pages/${component}/index.tsx`)),
  })),
];
