import CachedIcon from '@mui/icons-material/Cached';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Stack from "@mui/material/Stack";
import { UserButton } from "@features/userButton";
import { clearCacheApi as clearCacheApi } from "../api";
import { buttons } from "../utils";

export const Bpm002Buttons = () => {
  const { qryAll, qryArtifact, qryProcess, qryORG, qryTomcat, qryForm, qryStopApp } = buttons;

  //清空 AgentFlowCache(全部)
  const { mutate: mutate_ClearAgentFlowCache_All, isPending: isPending_ClearAgentFlowCache_All } = clearCacheApi.useFetchClearAgentFlowCache("ALL");
  const handleClearAgentFlowCache_All = () => {
    mutate_ClearAgentFlowCache_All();
  };

  //清空 AgentFlow Cache(ARTIFACT)
  const { mutate: mutate_ClearAgentFlowCache_Artifact, isPending: isPending_ClearAgentFlowCache_Artifact } = clearCacheApi.useFetchClearAgentFlowCache("ARTIFACT");
  const handleClearAgentFlowCache_Artifact = () => {
    mutate_ClearAgentFlowCache_Artifact();
  };

  //清空 AgentFlow Cache(PROCESS)
  const { mutate: mutate_ClearAgentFlowCache_Process, isPending: isFetching_ClearAgentFlowCache_Process } = clearCacheApi.useFetchClearAgentFlowCache("PROCESS");
  const handleClearAgentFlowCache_Process = () => {
    mutate_ClearAgentFlowCache_Process();
  };
  //清空 AgentFlow Cache(ORG)
  const { mutate: mutate_ClearAgentFlowCache_ORG, isPending: isPending_ClearAgentFlowCache_ORG } = clearCacheApi.useFetchClearAgentFlowCache("ORG");
  const handleClearAgentFlowCache_ORG = () => {
    mutate_ClearAgentFlowCache_ORG();
  };
  //清空 Tomcat Cache
  const { mutate: mutate_ClearTomcatCache, isPending: isPending_ClearTomcatCache } = clearCacheApi.useFetchClearTomcatCache();
  const handleClearTomcatCache = () => {
    mutate_ClearTomcatCache();
  };
  //清空 表單 Cache
  const { mutate: mutate_ClearFormCache, isPending: isPending_ClearFormCache } = clearCacheApi.useFetchClearFormCache();
  const handleClearFormCache = () => {
    mutate_ClearFormCache();
  };
  //重啟站台
  const { mutate: mutate_StopApp, isPending: isPending_StopApp } = clearCacheApi.useFetchStopApp();
  const handleStopApp = () => {
    mutate_StopApp();
  };

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, md: 2 }}
      useFlexGap
      flexWrap="wrap"
      height="100%"
      alignItems="center"
    >
      <UserButton
        featureName={qryAll.featureName}
        variant="outlined"
        startIcon={<PlayArrowIcon />}
        onClick={handleClearAgentFlowCache_All}
        isLoading={isPending_ClearAgentFlowCache_All}
      >
        {qryAll.label}
      </UserButton>

      <UserButton
        featureName={qryArtifact.featureName}
        variant="outlined"
        startIcon={<PlayArrowIcon />}
        onClick={handleClearAgentFlowCache_Artifact}
        isLoading={isPending_ClearAgentFlowCache_Artifact}
      >
        {qryArtifact.label}
      </UserButton>

      <UserButton
        featureName={qryProcess.featureName}
        variant="outlined"
        startIcon={<PlayArrowIcon />}
        onClick={handleClearAgentFlowCache_Process}
        isLoading={isFetching_ClearAgentFlowCache_Process}
      >
        {qryProcess.label}
      </UserButton>

      <UserButton
        featureName={qryORG.featureName}
        variant="outlined"
        startIcon={<PlayArrowIcon />}
        onClick={handleClearAgentFlowCache_ORG}
        isLoading={isPending_ClearAgentFlowCache_ORG}
      >
        {qryORG.label}
      </UserButton>

      <UserButton
        featureName={qryTomcat.featureName}
        variant="outlined"
        startIcon={<PlayArrowIcon />}
        onClick={handleClearTomcatCache}
        isLoading={isPending_ClearTomcatCache}
      >
        {qryTomcat.label}
      </UserButton>

      <UserButton
        featureName={qryForm.featureName}
        variant="outlined"
        startIcon={<PlayArrowIcon />}
        onClick={handleClearFormCache}
        isLoading={isPending_ClearFormCache}
      >
        {qryForm.label}
      </UserButton>

      <UserButton
        featureName={qryStopApp.featureName}
        variant="outlined"
        startIcon={<CachedIcon />}
        onClick={handleStopApp}
        isLoading={isPending_StopApp}
      >
        {qryStopApp.label}
      </UserButton>
    </Stack>
  );
};


