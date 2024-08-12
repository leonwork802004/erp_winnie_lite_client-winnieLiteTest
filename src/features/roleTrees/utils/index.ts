import { createContext } from "react";
import { RoleTreeSchema } from "../api";

export const getDataFromRoleTree = (roles: RoleTreeSchema[]): string[] => {
  const data: string[] = [];

  for (const role of roles) {
    if (role) {
      const { children } = role;
      data.push(role.Id.toString());

      if (children) {
        data.push(...getDataFromRoleTree(children));
      }
    }
  }

  return data;
};

export const TreeItemContext = createContext<{
  linkRoleId?: number[];
}>({ linkRoleId: [] });
