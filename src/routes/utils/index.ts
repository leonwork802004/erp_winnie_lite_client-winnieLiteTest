import { RouteObject } from "react-router-dom";
import { MenuSchema } from "@api/userRoot";

export const getFeatureName = (menus: MenuSchema[] | undefined): string[] => {
  const features: string[] = [];

  const processMenu = (menu: MenuSchema) => {
    if (menu.FeatureName) {
      features.push(menu.FeatureName);
    }

    if (menu.children) {
      for (const child of menu.children) {
        processMenu(child);
      }
    }
  };

  if (menus) {
    for (const menu of menus) {
      processMenu(menu);
    }
  }
  return features;
};

export const getFilterRoutes = (
  routes: RouteObject[],
  featureNames: string[]
): RouteObject[] =>
  routes
    .map((route) => {
      const hasFeature =
        featureNames.includes(route.path as string) || route.index === true;
      return hasFeature ? route : null;
    })
    .filter(Boolean) as RouteObject[];
