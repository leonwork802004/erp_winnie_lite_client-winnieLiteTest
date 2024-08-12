import { useMutation, useQuery } from "@tanstack/react-query";
import { BaseResponse, baseResponse } from "@appTypes/baseResponse";
import axios from "@lib/axios";
import { sys001Keys } from "./queryKey";
import {
  AddBtnPayload, AddBtnResponse, AddMenuBranchPayload, AddMenuBranchResponse, AddPageBtnPayload, AddPageBtnResponse, AddPagePayload, AddPageResponse, DeletePageBtnPayload,
  GetPageBtnPayload, MenuNodesResponse, MenuTreeResponse, NotRELBtnSchemaResponse, PageBtnResponse, UpdateBtnPayload, UpdateBtnResponse, UpdateMenuBranchPayload, UpdateMenuBranchResponse,
  UpdatePagePayload, UpdatePageResponse, addBtnResponse, addMenuBranchResponse, addPageBtnResponse, addPageResponse, menuNodesResponse, menuTreeResponse, notRELBtnSchemaResponse, pageBtnResponse,
  updateBtnResponse, updateMenuBranchResponse, updatePageResponse
} from "./type";

//#region  查詢目錄
const getMenuTree = async (): Promise<MenuTreeResponse> => {
  const { data } = await axios.get("/Menu/Trees");
  return menuTreeResponse.parse(data);
};

export const useGetMenuTrees = () => {
  return useQuery({
    queryKey: sys001Keys.getMenuTree(),
    queryFn: () => getMenuTree(),
    enabled: true,
  });
};
//#endregion

//#region  查詢頁面關聯按鈕
const getPageBtn = async (
  params: GetPageBtnPayload
): Promise<PageBtnResponse> => {
  const { data } = await axios.get("/Button/PageBtns", { params });
  return pageBtnResponse.parse(data);
};

export const useGetPageBtn = (data: GetPageBtnPayload) =>
  useQuery({
    queryKey: sys001Keys.getPageBtn(data),
    queryFn: () => getPageBtn(data),
    enabled: !!data.pageId,
  });
//#endregion

//#region  查詢目錄節點列表
const getMenuNodes = async (): Promise<MenuNodesResponse> => {
  const { data } = await axios.get("/Menu/MenuNodes");
  return menuNodesResponse.parse(data);
}

export const useGetMenuNodes = () =>
  useQuery({
    queryKey: sys001Keys.getMenuNodes(),
    queryFn: () => getMenuNodes(),
    enabled: true
  })

//#endregion

//#region 查詢尚未關聯按鈕
const getNotRELBtns = async (): Promise<NotRELBtnSchemaResponse> => {
  const { data } = await axios.get("/Button/NotRELBtns");
  return notRELBtnSchemaResponse.parse(data);
}

export const useGetNotRELBtns = () =>
  useQuery({
    queryKey: sys001Keys.getNotRELBtns(),
    queryFn: () => getNotRELBtns(),
    enabled: true
  })
//#endregion

//#region 新增目錄節點
const addMenuBranch = async (
  cmd: AddMenuBranchPayload
): Promise<AddMenuBranchResponse> => {
  const { data } = await axios.post("/Menu/MenuBranch", cmd);
  return addMenuBranchResponse.parse(data);
}

export const useAddMenuBranch = () =>
  useMutation({ mutationFn: addMenuBranch });
//#endregion

//#region 更新目錄節點
const updateMenuBranch = async ({
  MenuBranchesId,
  ...cmd
}: UpdateMenuBranchPayload): Promise<UpdateMenuBranchResponse> => {
  const { data } = await axios.patch("/Menu/MenuBranch", cmd, { params: { MenuBranchesId } });
  return updateMenuBranchResponse.parse(data);
};

export const useUpdateMenuBranch = () =>
  useMutation({ mutationFn: updateMenuBranch });
//#endregion

//#region 新增頁面
const addPage = async (
  cmd: AddPagePayload
): Promise<AddPageResponse> => {
  const { data } = await axios.post("/Menu/Page", cmd);
  return addPageResponse.parse(data);
}

export const useAddPage = () =>
  useMutation({ mutationFn: addPage });
//#endregion

//#region 更新頁面
const updatePage = async ({
  PageId,
  ...cmd
}: UpdatePagePayload): Promise<UpdatePageResponse> => {
  const { data } = await axios.patch("/Menu/Page", cmd, { params: { PageId } })
  return updatePageResponse.parse(data);
};

export const useUpdatePage = () =>
  useMutation({ mutationFn: updatePage });
//#endregion

//#region 新增按鈕
const addBtn = async (
  cmd: AddBtnPayload
): Promise<AddBtnResponse> => {
  const { data } = await axios.post("/Button/Btn", cmd)
  return addBtnResponse.parse(data);
}

export const useAddBtn = () =>
  useMutation({ mutationFn: addBtn })
//#endregion

//#region 更新按鈕
const updateBtn = async ({
  BtnId,
  ...cmd
}: UpdateBtnPayload): Promise<UpdateBtnResponse> => {
  const { data } = await axios.patch("/Button/Btn", cmd, { params: { BtnId } });
  return updateBtnResponse.parse(data);
};
export const useUpdateBtn = () =>
  useMutation({ mutationFn: updateBtn });
//#endregion

//#region 新增頁面關聯按鈕
const addPageBtn = async (
  cmd: AddPageBtnPayload
): Promise<AddPageBtnResponse> => {
  const { data } = await axios.post("/Button/PageBtn", cmd);
  return addPageBtnResponse.parse(data);
}

export const useAddPageBtn = () =>
  useMutation({ mutationFn: addPageBtn });
//#endregion

//#region 移除頁面關聯按鈕
export const deletePageBtn = async (
  cmd: DeletePageBtnPayload
): Promise<BaseResponse> => {
  const { data } = await axios.delete("/Button/PageBtn", { params: cmd });
  return baseResponse.parse(data);
}

export const useDeletePageBtn = () =>
  useMutation({ mutationFn: deletePageBtn })
//#endregion
