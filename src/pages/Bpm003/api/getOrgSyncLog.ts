import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import { bpm003Keys } from "./queryKey";
import { DeptPageRowsInfoResponse, FetchDataBySyncIdPayload, FetchDataPayload, FetchPageInfoPayload, MemPageRowsInfoResponse, PageInfoResponse, PageRowsInfoResponse, deptPageRowsInfoResponse, pageInfoResponse, pageRowsInfoResponse } from "./type";

//#region 查詢組織同步 Log 分頁資訊
const fetchPageInfo = async (
    params: FetchPageInfoPayload
): Promise<PageInfoResponse> => {
    const { data } = await axios.get("/BpmOrgSync/Data/Info", {
        params,
    });
    return pageInfoResponse.parse(data);
};

export const useFetchPageInfo = (data: FetchPageInfoPayload) =>
    useQuery({
        queryKey: bpm003Keys.dataInfo(data),
        queryFn: () => fetchPageInfo(data),
    });
//#endregion

//#region 查詢組織同步 Log by 分頁
const fetchData = async (
    params: FetchDataPayload
): Promise<PageRowsInfoResponse> => {
    const { data } = await axios.get("/BpmOrgSync/Data", {
        params,
    });
    return pageRowsInfoResponse.parse(data);
};
export const useFetchData = (data: FetchDataPayload) =>
    useQuery({
        queryKey: bpm003Keys.data(data),
        queryFn: () => fetchData(data),
    });
//#endregion

//#region 查詢組織同步 [部門] 異動 Log 分頁資訊
const fetchDeptPageInfo = async (
    params: FetchDataBySyncIdPayload
): Promise<PageInfoResponse> => {
    const { data } = await axios.get("/BpmOrgSync/Dept/Info", {
        params,
    });
    return pageInfoResponse.parse(data);
};

export const useFetchDeptPageInfo = (data: FetchDataBySyncIdPayload) =>
    useQuery({
        queryKey: bpm003Keys.deptInfo(data),
        queryFn: () => fetchDeptPageInfo(data),
        enabled: !!data.syncId
    });
//#endregion

//#region 查詢組織同步 [部門] 異動 Log by 分頁
const fetchDeptData = async (
    params: FetchDataBySyncIdPayload
): Promise<DeptPageRowsInfoResponse> => {
    const { data } = await axios.get("/BpmOrgSync/Dept", {
        params,
    });
    return deptPageRowsInfoResponse.parse(data);
};
export const useFetchDeptData = (data: FetchDataBySyncIdPayload) =>
    useQuery({
        queryKey: bpm003Keys.dept(data),
        queryFn: () => fetchDeptData(data),
        enabled: !!data.syncId
    });
//#endregion

//#region 查詢組織同步 [人員] 異動 Log 分頁資訊
const fetchMemPageInfo = async (
    params: FetchDataBySyncIdPayload
): Promise<PageInfoResponse> => {
    const { data } = await axios.get("/BpmOrgSync/Mem/Info", {
        params,
    });
    return pageInfoResponse.parse(data);
};

export const useFetchMemPageInfo = (data: FetchDataBySyncIdPayload) =>
    useQuery({
        queryKey: bpm003Keys.memInfo(data),
        queryFn: () => fetchMemPageInfo(data),
        enabled: !!data.syncId
    });
//#endregion

//#region 查詢組織同步 [人員] 異動 Log by 分頁
const fetchMemData = async (
    params: FetchDataBySyncIdPayload
): Promise<MemPageRowsInfoResponse> => {
    const { data } = await axios.get("/BpmOrgSync/Mem", {
        params,
    });
    return MemPageRowsInfoResponse.parse(data);
};
export const useFetchMemData = (data: FetchDataBySyncIdPayload) =>
    useQuery({
        queryKey: bpm003Keys.mem(data),
        queryFn: () => fetchMemData(data),
        enabled: !!data.syncId,
    });
//#endregion