import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import {
  AddRoleDataPayload,
  AddRoleDataResponse,
  FetchLinkPermissionsResponse,
  MoveTreesPayload,
  SetRoleDataResponse,
  UpdateRoleDataPayload,
  addRoleDataResponse,
  fetchLinkPermissionsResponse,
  setRoleDataResponse,
} from ".";

//#region 查詢角色關聯權限
const fetchLinkPermissions = async (
  id: number
): Promise<FetchLinkPermissionsResponse> => {
  const { data } = await axios.get("/role/link/permissions", {
    params: { id },
  });
  return fetchLinkPermissionsResponse.parse(data);
};
export const useFetchLinkPermissions = (id: number) =>
  useQuery({
    queryKey: ["role", "link", "permissions", id],
    queryFn: () => fetchLinkPermissions(id),
    enabled: !!id,
  });
//#endregion

//#region 移動角色樹狀圖節點
const moveTrees = async (
  params: MoveTreesPayload
): Promise<SetRoleDataResponse> => {
  const { data } = await axios.patch("/role/trees", null, { params });
  return setRoleDataResponse.parse(data);
};
export const useMoveTrees = () => useMutation({ mutationFn: moveTrees });
//#endregion

//#region 新增角色
const addRoleData = async (
  payload: AddRoleDataPayload
): Promise<AddRoleDataResponse> => {
  const { data } = await axios.post("/role/data", payload);
  return addRoleDataResponse.parse(data);
};
export const useAddRoleData = () => useMutation({ mutationFn: addRoleData });
//#endregion

//#region 修改角色
const updateRoleData = async ({
  id,
  ...payload
}: UpdateRoleDataPayload): Promise<SetRoleDataResponse> => {
  const { data } = await axios.patch("/role/data", payload, { params: { id } });
  return setRoleDataResponse.parse(data);
};
export const useUpdateRoleData = () =>
  useMutation({ mutationFn: updateRoleData });
//#endregion
