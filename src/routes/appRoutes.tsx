import { lazy } from "react";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useFetchUserRoot } from "@api/userRoot";
import { MainLayout } from "@components/Layout";
import Page404 from "@pages/Page404";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";
import { getFeatureName, getFilterRoutes } from "./utils";

export const AppRoutes = () => {
  const { data: menus } = useFetchUserRoot();
  const featureName = getFeatureName(menus?.Children);
  const filteredRoutes = getFilterRoutes(protectedRoutes, featureName);

  const routes: RouteObject = {
    path: "/",
    element: <MainLayout />,
    children: [
      ...publicRoutes,
      {
        Component: lazy(() => import("./ProtectedRoutes")),
        children: [...filteredRoutes],
      },
      { path: "*", element: <Page404 /> },
    ],
  };

  const router = createBrowserRouter([routes], {
    basename: import.meta.env.BASE_URL,
  });

  return <RouterProvider router={router} />;
};
