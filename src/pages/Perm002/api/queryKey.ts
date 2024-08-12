export const permissionKeys = {
  all: ["permission"] as const,
  dataInfo: (filters: object) =>
    [...permissionKeys.all, "data", "info", filters] as const,
  data: (filters: object) => [...permissionKeys.all, "data", filters] as const,
  linkRoles: () => [...permissionKeys.all, "link", "roles"],
};
