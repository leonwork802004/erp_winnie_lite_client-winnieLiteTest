export const bpm003Keys = {
    all: ["Bpm003"] as const,
    dataInfo: (filters: object) =>
        [...bpm003Keys.all, "data", "info", filters] as const,
    data: (filters: object) => [...bpm003Keys.all, "data", filters] as const,
    deptInfo: (filters: object) =>
        [...bpm003Keys.all, "dept", "info", filters] as const,
    dept: (filters: object) => [...bpm003Keys.all, "dept", filters] as const,
    memInfo: (filters: object) =>
        [...bpm003Keys.all, "mem", "info", filters] as const,
    mem: (filters: object) => [...bpm003Keys.all, "mem", filters] as const,
    syncMode: () => [...bpm003Keys.all, "syncMode"] as const,
};
