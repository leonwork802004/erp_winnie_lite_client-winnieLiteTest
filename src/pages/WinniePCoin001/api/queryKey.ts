export const pCoinActKeys = {
  all: ["WinniePCoin001", "PCoinAct"] as const,
  ActStatusMapping: () => [...pCoinActKeys.all, "ActStatusMapping"] as const,
  data: (filters: object) => [...pCoinActKeys.all, "data", filters] as const,
  actReleasers: () => [...pCoinActKeys.all, "actReleasers"] as const,
};
