import { useQuery, useMutation } from "@tanstack/react-query";
import { BaseResponse, baseResponse } from "@appTypes/baseResponse";
import axios from "@lib/axios";
import {
  FetchWinnieUserPayload,
  FetchWinnieUserRes,
  fetchWinnieUserRes,
  UpdateWinnieUser,
} from ".";

//#region 查詢
const fetchWinnieUser = async ({
  acct,
  name,
  empNo,
  usrNo,
}: FetchWinnieUserPayload): Promise<FetchWinnieUserRes> => {
  const { data } = await axios.get("/winnieUser/data", {
    params: {
      acct: acct,
      name: name,
      empNo: empNo,
      usrNo: usrNo,
    },
  });

  return fetchWinnieUserRes.parse(data);
};
export const useFetchWinnieUser = (data: FetchWinnieUserPayload) =>
  useQuery({
    queryKey: ["winnieUser", { data }],
    queryFn: () => fetchWinnieUser(data),
    enabled: !!data.acct || !!data.name || !!data.empNo || !!data.usrNo,
  });
//#endregion

const updateWinnieUser = async (
  usrNo: string,
  action: UpdateWinnieUser
): Promise<BaseResponse> => {
  const { data } = await axios.post(`/winnieUser/${action}`, {
    UsrNo: usrNo,
  });
  return baseResponse.parse(data);
};
const createMutationHook = (action: UpdateWinnieUser) => () =>
  useMutation({
    mutationFn: (usrNo: string) => updateWinnieUser(usrNo, action),
  });
export const useUnlockWinnieUser = createMutationHook(UpdateWinnieUser.unlock);
export const useUnlock15DWinnieUser = createMutationHook(
  UpdateWinnieUser.unlock15D
);
export const useResetPassword = createMutationHook(
  UpdateWinnieUser.resetPassword
);
