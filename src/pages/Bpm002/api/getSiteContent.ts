import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import { bpm002Keys } from "./queryKey";
import { FetchSiteContentResponse, fetchSiteContentResponse } from "./type";

//取得站台測試功能內容
export const fetchSiteContent = async (): Promise<FetchSiteContentResponse> => {
  const { data } = await axios.get("/BpmSite/SiteContent");
  return fetchSiteContentResponse.parse(data);
};

export const useFetchSiteContent = () => {
  return useQuery({
    queryKey: bpm002Keys.siteContent(),
    queryFn: fetchSiteContent,
  });
};
