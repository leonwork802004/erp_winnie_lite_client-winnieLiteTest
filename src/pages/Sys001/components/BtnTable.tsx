import { memo, useState } from "react";
import { Chip, Grid, Stack, Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid"
import { useGetPageBtn } from "../api/api";
import { GetPageBtnPayload, MenuTreeSchema, PageBtnSchema } from "../api/type";
import { statusMap } from "../utils";

type Props = {
    selectedMenuItem: MenuTreeSchema | null;
    onSelectItemChange: (pageBtn: PageBtnSchema | null) => void;
    rowSelectionModel: GridRowSelectionModel | undefined;
    setRowSelectionModel: (value: React.SetStateAction<GridRowSelectionModel | undefined>) => void;
};

export const BtnTable = memo(({
    selectedMenuItem: payload,
    onSelectItemChange,
    rowSelectionModel,
    setRowSelectionModel
}: Props) => {
    const param: GetPageBtnPayload = {
        pageId: payload?.PageId as number,
    }
    const { data } = useGetPageBtn(param);

    //#region 欄位

    const [columns, setColumns] = useState<GridColDef[]>([
        {
            field: 'Id',
            headerName: '按鈕編號',
            minWidth: 50,
            renderCell: (params) => (
                params.value
            ),
        },
        {
            field: 'Name',
            headerName: '按鈕關聯名稱',
            minWidth: 200,
            width: 400,
            renderCell: (params) => (
                params.value
            ),
        },
        {
            field: 'Title',
            headerName: '按鈕標題',
            minWidth: 200,
            width: 400,
            renderCell: (params) => (
                params.value
            ),
        },
        {
            field: 'CreatedAt',
            headerName: '建立時間',
            minWidth: 200,
            renderCell: (params) => (
                params.value ? new Date(params.value).toLocaleString() : null
            )
        },
        {
            field: 'Status',
            headerName: '按鈕狀態',
            minWidth: 150,
            type: 'singleSelect',
            renderCell: (params) => {
                return (
                    <Chip
                        sx={{ bgcolor: params.value == "啟用" ? green[100] : red[100] }}
                        label={params.value}
                    />
                )
            },
            valueGetter: (_value, row) => {
                return statusMap.find((status) => status.key === row.Status)?.value;
            },
            valueOptions: statusMap.map(status => status.value),
        },

    ]);
    //#endregion

    const handleSelectionChange = (selection: PageBtnSchema | null) => {
        onSelectItemChange(selection);
    }

    const handleColumnWidthChange = (updatedCol: GridColDef) => {
        const updatedColumns = columns.map(col =>
            col.field === updatedCol.field ? updatedCol : col
        );
        setColumns(updatedColumns);
    };

    return (
        <Grid container direction={"column"}>
            <Grid item xs="auto">
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Typography variant="h5" mb={1}>
                        頁面關聯按鈕
                    </Typography>
                    <Typography>{payload?.Title}</Typography>
                </Stack>
            </Grid>
            <Grid item xs container>
                <DataGrid
                    rows={data?.Data || []}
                    columns={columns}
                    getRowId={(row) => row.Id}
                    rowHeight={50}
                    columnHeaderHeight={37}
                    hideFooterSelectedRowCount
                    sx={{
                        height: "calc(100dvh - 194px)",
                        border: 0
                    }}
                    hideFooter
                    rowSelectionModel={rowSelectionModel}
                    onRowSelectionModelChange={(ids) => {
                        setRowSelectionModel(ids);
                        handleSelectionChange(
                            data?.Data?.find((btn) => btn.Id === ids[0]) || null
                        );
                    }}
                    onColumnWidthChange={(col) => {
                        handleColumnWidthChange(col.colDef as GridColDef);
                    }}
                />
            </Grid>
        </Grid>
    )
})