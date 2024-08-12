import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import {
  AddDataPayload,
  FetchDataPayload,
  FetchPageInfoPayload,
  PageInfoResponse,
  PageRowsInfoResponse,
  RoleDataResponse,
  SetDataResponse,
  SetLinkRolesPayload,
  UpdateDataPayload,
  UpdateDataResponse,
  pageInfoResponse,
  pageRowsInfoResponse,
  roleDataResponse,
  setDataResponse,
  updateDataResponse,
} from "./permissionType";
import { permissionKeys } from "./queryKey";

//#region 查詢權限分頁資訊
const fetchPageInfo = async (
  params: FetchPageInfoPayload
): Promise<PageInfoResponse> => {
  const { data } = await axios.get("/permission/data/info", {
    params,
  });
  return pageInfoResponse.parse(data);
};
export const useFetchPageInfo = (data: FetchPageInfoPayload) =>
  useQuery({
    queryKey: permissionKeys.dataInfo(data),
    queryFn: () => fetchPageInfo(data),
  });
//#endregion

//#region 查詢權限 by 分頁
const fetchData = async (
  params: FetchDataPayload
): Promise<PageRowsInfoResponse> => {
  const { data } = await axios.get("/permission/data", {
    params,
  });
  return pageRowsInfoResponse.parse(data);
};
export const useFetchData = (data: FetchDataPayload) =>
  useQuery({
    queryKey: permissionKeys.data(data),
    queryFn: () => fetchData(data),
  });
//#endregion

//#region 新增權限
const addData = async (cmd: AddDataPayload): Promise<SetDataResponse> => {
  const { data } = await axios.post("/permission/data", cmd);
  return setDataResponse.parse(data);
};
export const useAddData = () =>
  useMutation({
    mutationFn: addData,
  });
//#endregion

//#region 修改權限
const updateData = async ({
  Id,
  ...cmd
}: UpdateDataPayload): Promise<UpdateDataResponse> => {
  const { data } = await axios.patch("/permission/data", cmd, {
    params: { id: Id },
  });
  return updateDataResponse.parse(data);
};
export const useUpdateData = () => useMutation({ mutationFn: updateData });
//#endregion

//#region 查詢權限關聯角色
const fetchLinkRoles = async (id: number): Promise<RoleDataResponse> => {
  const { data } = await axios.get("/permission/link/roles", {
    params: { id },
  });
  return roleDataResponse.parse(data);
};
export const useFetchLinkRoles = (id: number, isOpen: boolean) =>
  useQuery({
    queryKey: permissionKeys.linkRoles(),
    queryFn: () => fetchLinkRoles(id),
    enabled: isOpen,
  });
//#endregion

//#region 授權角色權限
const setLinkRoles = async (
  cmd: SetLinkRolesPayload
): Promise<SetDataResponse> => {
  const { data } = await axios.put("/permission/link/roles", null, {
    params: cmd,
  });
  return setDataResponse.parse(data);
};
export const useSetLinkRoles = () => useMutation({ mutationFn: setLinkRoles });
//#endregion

//#region 移除角色權限
const deleteLinkRoles = async (
  cmd: SetLinkRolesPayload
): Promise<SetDataResponse> => {
  const { data } = await axios.delete("/permission/link/roles", {
    params: cmd,
  });
  return setDataResponse.parse(data);
};
export const useDeleteLinkRoles = () =>
  useMutation({ mutationFn: deleteLinkRoles });
//#endregion
