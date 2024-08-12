import { useMutation, useQuery } from "@tanstack/react-query";
import { BaseResponse, baseResponse } from "@appTypes/baseResponse";
import axios from "@lib/axios";
import { SyncModeResponse, UpdateSyncModeDataPayload, syncModeResponse, bpm003Keys } from ".";

//#region 查詢組織同步模式
const getSyncModeData = async (): Promise<SyncModeResponse> => {
    const { data } = await axios.get("/BpmOrgSync/Sync/Mode");
    return syncModeResponse.parse(data);
}

export const useFetchData = () =>
    useQuery({
        queryKey: bpm003Keys.syncMode(),
        queryFn: () => getSyncModeData(),
    });
//#endregion

//#region 設定組織同步模式
const updateSyncModeData = async (
    payload: UpdateSyncModeDataPayload
): Promise<BaseResponse> => {
    const { data } = await axios.put("/BpmOrgSync/Sync/Mode", null, { params: { ...payload } });
    return baseResponse.parse(data);
};
export const useUpdateSyncModeData = () =>
    useMutation({ mutationFn: updateSyncModeData });
//#endregion