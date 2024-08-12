import { ReactNode, memo, useMemo, useState } from "react";
import React from "react";
import { Stack, Tab, Tabs, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getOrgSyncLogApi } from "../api";
import { CompareDataDialog } from "./CompareDataDialog";

type Props = {
    syncId: number | undefined;
};

export const Bpm003Tabs = memo(({ syncId }: Props) => {
    //#region 分頁
    const pageSize = 10;
    const pageSizeOptions = [10, 50, 100];
    //#endregion

    //#region tab 頁籤
    const tabs = [
        "部門",
        "人員",
    ];
    const [tabValue, setTabValue] = useState<number>(0);
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        const scrollY = window.scrollY;
        setTabValue(newValue);
        setTimeout(() => window.scrollTo(0, scrollY), 0);
    };

    interface Props {
        children: ReactNode;
    }

    function TabPanel({ children }: Props) {
        return (
            <div role="tabpanel">
                {children}
            </div>
        );
    }
    //#endregion

    //#region 共用
    //類型
    const types = [
        { key: 1, value: "新增" },
        { key: 2, value: "異動" },
        { key: 3, value: "歷史" },
        { key: 4, value: "復原" },
    ]
    //#endregion

    //#region 部門

    //#region 分頁
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: pageSize,
    });

    const { data: fetchDataInfo } = getOrgSyncLogApi.useFetchDeptPageInfo({
        syncId,
        size: paginationModel.pageSize,
    });

    const pageInfo = fetchDataInfo?.Data;
    //#endregion

    //#region table data
    const fetchDataPayload = useMemo(() => {
        return {
            syncId,
            size: paginationModel.pageSize,
            page: paginationModel.page + 1,
        };
    }, [syncId, paginationModel.page, paginationModel.pageSize]);

    const { data: fetchData, isLoading: deptIsLoading } = getOrgSyncLogApi.useFetchDeptData(fetchDataPayload);
    const deptRows = fetchData?.Data.Rows;
    //#endregion

    const deptColumns: GridColDef[] = [
        {
            field: 'Type',
            headerName: '類型',
            minWidth: 100,
            resizable: false,
            type: 'singleSelect',
            renderCell: (params) => {
                return fetchData && (
                    <CompareDataDialog
                        props={params} type={"dept"} dataPayload={fetchDataPayload}
                    />
                )
            },
            valueGetter: (_value, row) => {
                return types.find((type) => type.key === row.Type)?.value;
            },
            valueOptions: types.map(type => type.value),
        },
        {
            field: 'DepNo',
            headerName: '部門代碼 (網家)',
            flex: 0.4,
            minWidth: 150,
            renderCell: (params) => (
                <Tooltip title={params.row.DepId} placement="bottom-start" arrow>
                    <span>{params.row.DepNo}</span>
                </Tooltip>
            ),
        },
        {
            field: 'DepName',
            headerName: '部門名稱',
            flex: 1,
            minWidth: 450,
            renderCell: (params) => (
                params.value
            ),
        },
        {
            field: 'Parent.DepNo',
            headerName: '上層部門代碼 (網家)',
            flex: 0.4,
            minWidth: 150,
            renderCell: (params) => (
                <Tooltip title={params.row.Parent.DepId} placement="bottom-start" arrow>
                    <span>{params.row.Parent?.DepNo || ""}</span>
                </Tooltip>
            ),
        },
        {
            field: 'Manager.EmpNo',
            headerName: '主管員工編號',
            flex: 0.4,
            minWidth: 150,
            renderCell: (params) => (
                params.row.Manager?.EmpNo || ""
            ),
        },
        {
            field: 'Manager.Username',
            headerName: '主管姓名',
            flex: 0.4,
            minWidth: 150,
            renderCell: (params) => (
                params.row.Manager?.Username || ""
            ),
        },
    ];

    //#endregion

    //#region 人員

    //#region 分頁
    const [memPaginationModel, setMemPaginationModel] = useState({
        page: 0,
        pageSize: pageSize,
    });

    const { data: fetchMemDataInfo } = getOrgSyncLogApi.useFetchMemPageInfo({
        syncId,
        size: memPaginationModel.pageSize,
    });

    const memePageInfo = fetchMemDataInfo?.Data;
    //#endregion

    //#region table data
    const fetchMemDataPayload = useMemo(() => {
        return {
            syncId,
            size: memPaginationModel.pageSize,
            page: memPaginationModel.page + 1,
        };
    }, [syncId, memPaginationModel.page, memPaginationModel.pageSize]);

    const { data: fetchMemData, isLoading } = getOrgSyncLogApi.useFetchMemData(fetchMemDataPayload);
    const memRows = fetchMemData?.Data.Rows;
    //#endregion

    const memColumns: GridColDef[] = [
        {
            field: 'Type',
            headerName: '類型',
            minWidth: 100,
            resizable: false,
            type: 'singleSelect',
            renderCell: (params) => {
                return fetchMemData && (
                    <CompareDataDialog
                        props={params} type="mem" dataPayload={fetchMemDataPayload}
                    />
                )
            },
            valueGetter: (_value, row) => {
                return types.find((type) => type.key === row.Type)?.value;
            },
            valueOptions: types.map(type => type.value),
        },
        {
            field: 'EmpNo',
            headerName: '員工編號 (網家)',
            flex: 0.1,
            minWidth: 150,
            renderCell: (params) => (
                <Tooltip title={params.row.MemId} placement="bottom-start" arrow>
                    <span>{params.value}</span>
                </Tooltip>
            ),
        },
        {
            field: 'Username',
            headerName: '員工姓名',
            flex: 0.1,
            minWidth: 150,
            renderCell: (params) => (
                params.value
            ),
        },
        {
            field: 'RolId',
            headerName: '職務編號',
            flex: 0.3,
            minWidth: 300,
            renderCell: (params) => (
                params.value
            ),
        },
        {
            field: 'Department.DepNo',
            headerName: '部門代碼 (網家)',
            flex: 0.2,
            minWidth: 150,
            renderCell: (params) => (
                <Tooltip title={params.row.Department.DepId} placement="bottom-start" arrow>
                    <span>{params.row.Department?.DepNo || ""}</span>
                </Tooltip>

            ),
        },
        {
            field: 'Department.DepName',
            headerName: '部門名稱',
            flex: 0.3,
            minWidth: 300,
            renderCell: (params) => (
                params.row.Department?.DepName || ""
            ),
        },
    ];
    //#endregion

    return (
        <Stack>
            <Tabs
                variant="scrollable"
                scrollButtons="auto"
                value={tabValue}
                onChange={handleTabChange}
                sx={{ m: 0.5 }}
            >
                {tabs.map((tab) => (
                    <Tab key={tab} label={tab} />
                ))}
            </Tabs>

            {/* 部門 */}
            {tabValue === 0 && (
                <TabPanel >
                    <DataGrid
                        rows={deptRows || []}
                        columns={deptColumns}
                        rowHeight={50}
                        columnHeaderHeight={37}
                        hideFooterSelectedRowCount
                        rowSelection={false}
                        getRowId={(row) => row.DepId}
                        loading={deptIsLoading}
                        sx={{
                            flexDirection: "column-reverse", //讓pagination顯示在上方
                            height: "calc(50dvh - 96px)",
                            '& .MuiDataGrid-footerContainer': {
                                border: 0
                            },
                            border: 0
                        }}
                        pageSizeOptions={pageSizeOptions}
                        paginationModel={paginationModel}
                        rowCount={pageInfo?.RowCount || 0}
                        paginationMode="server"
                        onPaginationModelChange={setPaginationModel}
                    />
                </TabPanel>
            )
            }

            {/* 人員 */}
            {tabValue === 1 && (
                <TabPanel>
                    {/* 顯示被點擊行的資料 
                    <pre>{JSON.stringify(memRows, null, 2)}</pre>*/}
                    <DataGrid
                        rows={memRows || []}
                        columns={memColumns}
                        rowHeight={50}
                        columnHeaderHeight={37}
                        hideFooterSelectedRowCount
                        rowSelection={false}
                        getRowId={(row) => row.MemId}
                        loading={isLoading}
                        sx={{
                            flexDirection: "column-reverse", //讓pagination顯示在上方
                            height: "calc(50dvh - 96px)",
                            '& .MuiDataGrid-footerContainer': {
                                border: 0
                            },
                            border: 0
                        }}
                        pageSizeOptions={pageSizeOptions}
                        paginationModel={memPaginationModel}
                        rowCount={memePageInfo?.RowCount || 0}
                        paginationMode="server"
                        onPaginationModelChange={setMemPaginationModel}
                    />
                </TabPanel>
            )}
        </Stack >
    );
});