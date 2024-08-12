import { useMutation, useQuery } from "@tanstack/react-query";
import { BaseResponse, baseResponse } from "@appTypes/baseResponse";
import axios from "@lib/axios";
import { pCoinActKeys } from "./queryKey";
import {
  GetActReleasersResponse,
  GetActStatusMappingResponse,
  GetPCoinActDataPayload,
  GetPCoinActDataResponse,
  ModifyCoinLimitPayload,
  ReleasePCoinActPayload,
  getActReleasersResponse,
  getActStatusMappingResponse,
  getPCoinActDataResponse,
} from "./type";

//#region P 幣活動狀態 對照表
const getActStatusMapping = async (): Promise<GetActStatusMappingResponse> => {
  const { data } = await axios.get("/PCoinAct/ActStatusMapping");
  return getActStatusMappingResponse.parse(data);
};
export const useGetActStatusMapping = () =>
  useQuery({
    queryKey: pCoinActKeys.ActStatusMapping(),
    queryFn: getActStatusMapping,
  });
//#endregion

//#region P 幣活動查詢
const getPCoinActData = async (
  params: GetPCoinActDataPayload
): Promise<GetPCoinActDataResponse> => {
  const { data } = await axios.get("/PCoinAct/data", { params });
  return getPCoinActDataResponse.parse(data);
};
export const useGetPCoinActData = (data: GetPCoinActDataPayload) =>
  useQuery({
    queryKey: pCoinActKeys.data(data),
    queryFn: () => getPCoinActData(data),
    enabled: !!data.id || (!!data.begin && !!data.end),
  });
//#endregion

//#region 修改贈送點數限制
const modifyCoinLimit = async (
  params: ModifyCoinLimitPayload
): Promise<BaseResponse> => {
  const { data } = await axios.patch("/PCoinAct/CoinLimit", null, { params });
  return baseResponse.parse(data);
};
export const useModifyCoinLimit = () =>
  useMutation({ mutationFn: modifyCoinLimit });
//#endregion

//#region 查詢放行人清單
const getActReleasers = async (): Promise<GetActReleasersResponse> => {
  const { data } = await axios.get("/PCoinAct/ActReleasers");
  return getActReleasersResponse.parse(data);
};
export const useGetActReleasers = () =>
  useQuery({ queryKey: pCoinActKeys.actReleasers(), queryFn: getActReleasers });
//#endregion

//#region 活動強制放行
const releasePCoinAct = async (
  params: ReleasePCoinActPayload
): Promise<BaseResponse> => {
  const { data } = await axios.patch(
    "/PCoinAct/ReleaseAct",
    {
      helpReleaser: params.helpReleaser,
    },
    { params: { id: params.id } }
  );
  return baseResponse.parse(data);
};
export const useReleasePCoinAct = () =>
  useMutation({ mutationFn: releasePCoinAct });
//#endregion
