export const bpm002Keys = {
  all: ["Bpm002"] as const,
  clearAgentFlowCache: () => [...bpm002Keys.all, "ClearAgentFlowCache"] as const,
  ClearTomcatCache: () => [...bpm002Keys.all, "ClearTomcatCache"] as const,
  ClearFormCache: () => [...bpm002Keys.all, "ClearFormCache"] as const,
  StopApp: () => [...bpm002Keys.all, "StopApp"] as const,
  siteContent: () => [...bpm002Keys.all, "SiteContent"] as const,
  connRes: () => [...bpm002Keys.all, "ConnRes"] as const,
};
