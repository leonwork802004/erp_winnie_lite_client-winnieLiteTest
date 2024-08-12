import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { BaseResponse, baseResponse } from "@appTypes/baseResponse";
import axios from "@lib/axios";
import { bpm002Keys } from "./queryKey";


//清除AgentFlow Cache
const fetchClearAgentFlowCache = async (
  type?: string
): Promise<BaseResponse> => {
  const { data } = await axios.put("/BpmSite/ClearAgentFlowCache", null, {
    params: {
      type: type,
    },
  });

  return baseResponse.parse(data);
};

export const useFetchClearAgentFlowCache = (type?: string) => {

  let typeName = "";

  switch (type) {
    case "ALL":
      typeName = "清空 AgentFlow Cache(全部)";
      break;
    case "ARTIFACT":
      typeName = "清空 AgentFlow Cache(ARTIFACT)";
      break;
    case "PROCESS":
      typeName = "清空 AgentFlow Cache(PROCESS)";
      break;
    case "ORG":
      typeName = "清空 AgentFlow Cache(ORG)";
      break;
  }

  return useMutation({
    mutationKey: [bpm002Keys.clearAgentFlowCache(), type],
    mutationFn: () => fetchClearAgentFlowCache(type),
    onSuccess: () =>
      toast.success(`${typeName} 執行成功`, {
        style: {
          maxWidth: 500
        }
      }),
    onError: (error: AxiosError) =>
      toast.error(`${typeName} 執行異常: ${error.message}`, {
        style: {
          maxWidth: 500
        }
      }),
  });
};

//清除Tomcat Cache
const fetchClearTomcatCache = async (): Promise<BaseResponse> => {
  const { data } = await axios.put("/BpmSite/ClearTomcatCache", null);

  return baseResponse.parse(data);
};

export const useFetchClearTomcatCache = () => {
  return useMutation({
    mutationKey: [bpm002Keys.ClearTomcatCache()],
    mutationFn: () => fetchClearTomcatCache(),
    onSuccess: () =>
      toast.success("清除Tomcat快取 執行成功"),
    onError: (error: AxiosError) =>
      toast.error(`清除Tomcat快取 執行異常: ${error.message}`),
  });
};

//清除表單 Cache
const fetchClearFormCache = async (): Promise<BaseResponse> => {
  const { data } = await axios.put("/BpmSite/ClearFormCache", null);

  return baseResponse.parse(data);
};

export const useFetchClearFormCache = () => {
  return useMutation({
    mutationKey: [bpm002Keys.ClearFormCache()],
    mutationFn: () => fetchClearFormCache(),
    onSuccess: () =>
      toast.success("清除表單快取 執行成功"),
    onError: (error: AxiosError) =>
      toast.error(`清除表單快取 執行異常: ${error.message}`),
  });
};

//重啟站台
const fetchStopApp = async (): Promise<BaseResponse> => {
  const { data } = await axios.put("/BpmSite/StopApp", null);

  return baseResponse.parse(data);
};

export const useFetchStopApp = () => {
  return useMutation({
    mutationKey: bpm002Keys.StopApp(),
    mutationFn: () => fetchStopApp(),
    onSuccess: () =>
      toast.success("重啟站台 執行成功"),
    onError: (error: AxiosError) =>
      toast.error(`重啟站台 執行異常: ${error.message}`),
  });
};
