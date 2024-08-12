import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "@lib/axios";
import { FetchDepPayload, FetchDepResponse, fetchDepResponse } from ".";

//#region  查詢部門
const fetchDep = async ({
  depNo,
  depNameLike,
  exclHist,
}: FetchDepPayload): Promise<FetchDepResponse> => {
  const { data } = await axios.get("/BpmDep/Data", {
    params: {
      depNo: depNo,
      depNameLike: depNameLike,
      exclHist: exclHist,
    },
  });

  if (data.Code.includes("200-002")) {
    toast.error("查無此部門");
    return {
      Msg: data.Msg,
      Code: data.Code,
      Data: data.Data,
    };
  } else {  
    return fetchDepResponse.parse(data);
  }
};

export const useFetchDep = (param: FetchDepPayload) => {
  return useQuery({
    queryKey: ["getDept", { param }],
    queryFn: () => fetchDep(param),
    enabled: !!param.depNo || !!param.depNameLike,
  });
};
//#endregion
