import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import { bpm002Keys } from "./queryKey";
import { FetchConnResponse, fetchConnResResponse } from "./type";

//取得站台測試功能內容
export const fetchConnRes = async (): Promise<FetchConnResponse> => {
  const { data } = await axios.get("/BpmSite/ConnRes");
  return fetchConnResResponse.parse(data);
};

export const useFetchConnRes = () => {
  return useQuery({
    queryKey: bpm002Keys.connRes(),
    queryFn: fetchConnRes,
    enabled: false,
  });
};
