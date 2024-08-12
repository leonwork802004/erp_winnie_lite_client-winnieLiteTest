import { lazy } from "react";
import { RouteObject } from "react-router-dom";

export const publicRoutes: RouteObject[] = [
  {
    path: "login",
    Component: lazy(() => import("../pages/Login/index.tsx")),
  },
];
