import { useCallback, useMemo, useState } from "react";
import React from "react";
import { Grid, MenuItem, Stack, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridPagination, GridRowSelectionModel } from "@mui/x-data-grid";
import { Item } from "@components/Elements";
import { useFetchUserPage } from "@features/userButton";
import { useSessionStorageState } from "@hooks/useSessionStorageState";
import { useTableSelected } from "@hooks/useTableSelected";
import { PageDataSchema, getOrgSyncLogApi, FetchPageInfoPayload } from "./api";
import { Bpm003Tabs, SetSyncModeDialog } from "./components";
import { buttons } from "./utils";

const Bpm003 = () => {
    //#region Log 歷程主檔欄位
    const columns: GridColDef[] = [
        {
            field: 'SyncId',
            headerName: '同步編號',
            minWidth: 100,
            renderCell: (params) => (
                params.value
            ),
        },
        {
            field: 'CreatedAt',
            headerName: 'Log 寫入時間',
            minWidth: 300,
            flex: 1,
            renderCell: (params) => (
                new Date(params.value).toLocaleString()
            ),
        },
        {
            field: 'NumberOfDepartments',
            headerName: '匯入部門數量',
            minWidth: 140,
            renderCell: (params) => (
                params.value
            ),
        },
        {
            field: 'NumberOfMembers',
            headerName: '匯入人員數量',
            minWidth: 140,
            renderCell: (params) => (
                params.value
            ),
        },
        {
            field: 'GeneratedAt',
            headerName: '同步資料暫存產生時間',
            minWidth: 300,
            flex: 1,
            renderCell: (params) => (
                params.value ? new Date(params.value).toLocaleString() : ""
            ),
        },
        {
            field: 'SyncedAt',
            headerName: '同步完成時間',
            minWidth: 300,
            flex: 1,
            renderCell: (params) => (
                params.value ? new Date(params.value).toLocaleString() : ""
            ),
        },
    ];
    //#endregion

    //#region Row點擊事件
    const [show, setShow] = useState(false);
    //const gridRef = useRef<null | HTMLDivElement>(null);
    const handleRowClick = () => {
        setShow(true);
        // setTimeout(() => {
        //     if (gridRef.current) {
        //         gridRef.current.scrollIntoView({ behavior: 'smooth' });
        //     }
        // }, 0);
    };
    //#endregion

    //#region 分頁
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [input, setInput] =
        useSessionStorageState<FetchPageInfoPayload>("input", {
            synced: 1,
        });
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setInput({
                ...input,
                [e.target.name]: e.target.value,
            });
            setPaginationModel({ ...paginationModel, page: 0 });
        },
        [input, paginationModel, setInput]
    );

    const { data: fetchDataInfo } = getOrgSyncLogApi.useFetchPageInfo({
        ...input,
        size: paginationModel.pageSize,
    });

    const pageInfo = fetchDataInfo?.Data;

    //component綁定權限 進入頁面時才不會load到api 導致403
    function SetSyncBtn() {
        const { setSyncMode } = buttons;
        const { data } = useFetchUserPage(setSyncMode.featureName.split("_")[0]);
        if (data?.featureNames.includes(setSyncMode.featureName)) {
            return (
                <SetSyncModeDialog />
            )
        }
    }

    function CustomPagination() {
        return (
            <Stack direction="row" width="100%" m={1} justifyContent="space-between" alignItems="center" >
                <Grid container width="auto">
                    <TextField
                        select
                        label="狀態"
                        defaultValue={1}
                        size="small"
                        value={input.synced}
                        onChange={handleInputChange}
                        name="synced"
                        sx={{ mr: 2 }}
                    >
                        <MenuItem value=" ">全部</MenuItem>
                        <MenuItem value={1}>同步完成</MenuItem>
                        <MenuItem value={0}>同步失敗</MenuItem>
                    </TextField>
                    <SetSyncBtn />
                </Grid>
                <GridPagination sx={{ flex: 1 }} />
            </Stack>
        )
    }

    //#endregion

    //#region Log table data
    const [rowSelectionModel, setRowSelectionModel] =
        useState<GridRowSelectionModel>();

    const { selected, handleSelectedClick } =
        useTableSelected<PageDataSchema>();

    const fetchDataPayload = useMemo(() => {
        return {
            ...input,
            size: paginationModel.pageSize,
            page: paginationModel.page + 1,
        };
    }, [input, paginationModel.page, paginationModel.pageSize]);

    const { data: fetchData } = getOrgSyncLogApi.useFetchData(fetchDataPayload);
    const rows = fetchData?.Data.Rows;
    //#endregion

    return (
        <Grid
            container
            direction="column"
            spacing={2}
            p={2}
            columns={2}
        >
            <Grid item container xs={5}>
                <Item sx={{ p: 0, height: '100%' }}>
                    <DataGrid
                        rows={rows || []}
                        columns={columns}
                        getRowId={(row) => row.SyncId}
                        rowHeight={50}
                        columnHeaderHeight={37}
                        hideFooterSelectedRowCount
                        sx={{
                            flexDirection: "column-reverse", //讓pagination顯示在上方
                            height: "calc(50dvh - 60px)",
                            border: 0,
                            '& .MuiDataGrid-footerContainer': {
                                height: "60px !important",
                                minHeight: "60px !important"
                            },
                        }}
                        onRowClick={handleRowClick}
                        rowSelectionModel={rowSelectionModel}
                        onRowSelectionModelChange={(ids) => {
                            setRowSelectionModel(ids);
                            handleSelectedClick(
                                rows?.find((row) => row.SyncId === ids[0]) || null
                            );
                        }}
                        pageSizeOptions={[10, 50, 100]}
                        paginationModel={paginationModel}
                        rowCount={pageInfo?.RowCount || 0}
                        paginationMode="server"
                        onPaginationModelChange={setPaginationModel}
                        slots={{
                            pagination: CustomPagination,
                        }}
                    />
                </Item>
            </Grid>
            <Grid item container xs={5}>
                {/* <div ref={gridRef as React.Ref<HTMLDivElement>} style={{ width: "100%" }}> */}
                {show &&
                    <Item sx={{ p: 0, height: '100%' }}>
                        <Bpm003Tabs
                            syncId={selected?.SyncId}
                        />
                    </Item>
                }
                {/* </div> */}
            </Grid>
        </Grid >
    )
}

export default Bpm003;