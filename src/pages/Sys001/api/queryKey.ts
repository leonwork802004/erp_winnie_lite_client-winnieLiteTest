export const sys001Keys = {
    all: ["Sys001"] as const,
    getMenuTree: () => [...sys001Keys.all, "GetMenuTrees"] as const,
    getPageBtn: (filters: object) => [...sys001Keys.all, "GetPageBtn", filters] as const,
    getMenuNodes: () => [...sys001Keys.all, "GetMenuNodes"] as const,
    getNotRELBtns: () => [...sys001Keys.all, "GetNotRELBtns"] as const,
};
