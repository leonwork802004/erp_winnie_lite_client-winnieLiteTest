import { z } from 'zod';
import CloseIcon from '@mui/icons-material/Close';
import { Button, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import MuiDialog from "@mui/material/Dialog";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useDisclosure } from "@hooks/useDisclosure";
import { FetchDataBySyncIdPayload, getOrgSyncLogApi } from "../api";

export const CompareDataDialog: React.FC<{ props: GridRenderCellParams, type: string, dataPayload: FetchDataBySyncIdPayload }> = ({ props, type, dataPayload }) => {
    //#region 按鈕樣式 / 判斷
    const buttonStyle = {
        borderRadius: "16px",
        alignContent: "center",
        maxWidth: 120,
        height: 32,
        fontSize: "14px",
        color: "black !important",
        bgcolor: "#FFCDD2",
        textAlign: "center"
    };
    let tooltip = "";
    let disabled = true;

    if (props.value === "異動") {
        buttonStyle.bgcolor = '#FFCDD2';
        tooltip = "查看異動資料對比";
        disabled = false;
    } else if (props.value === "歷史") {
        buttonStyle.bgcolor = '#DEB887';
    } else if (props.value === "新增") {
        buttonStyle.bgcolor = '#C8E6C9';
    } else if (props.value === "復原") {
        buttonStyle.bgcolor = '#BCE3F9';
    }
    //#endregion

    //#region 彈跳視窗
    const { isOpen, open, close } = useDisclosure();
    const handleClose = () => {
        close();
    };
    //#endregion

    //#region Table Columns、Rows

    //類型
    const types = [
        { key: 1, value: "新增" },
        { key: 2, value: "異動" },
        { key: 3, value: "歷史" },
        { key: 4, value: "復原" },
    ]

    //Table Schema
    const tableSchema = z.object({
        title: z.string().optional(),
        value: z.string(),
        tooltip: z.string().optional(),
    });

    const arrayTableSchema = z.array(tableSchema);
    type ArrayTableSchema = z.infer<typeof arrayTableSchema>;

    let title = "";
    let afterTable: ArrayTableSchema = [];
    let beforeTable: ArrayTableSchema = [];

    const { data: fetchDeptData } = getOrgSyncLogApi.useFetchDeptData(dataPayload);
    const deptRow = fetchDeptData?.Data.Rows?.find(value => value.DepId == props.row.DepId && types.find((type) => type.key === value.Type)?.key === 2);
    const deptRowB4 = deptRow && deptRow.B4;

    const { data: fetchMemData } = getOrgSyncLogApi.useFetchMemData(dataPayload);
    const memRow = fetchMemData?.Data.Rows?.find(value => value.MemId == props.row.MemId && types.find((type) => type.key === value.Type)?.key === 2);
    const memRowB4 = memRow && memRow.B4;

    switch (type) {
        //部門
        case "dept": {
            title = `${props.row.DepNo} 異動資料對比`;

            afterTable = deptRow ? [
                { title: "部門代碼 (網家)", value: deptRow["DepNo"] || "", tooltip: deptRow["DepId"] || "" },
                { title: "部門名稱", value: deptRow["DepName"] || "" },
                { title: "上層部門代號 (網家)", value: deptRow.Parent?.["DepNo"] || "", tooltip: deptRow.Parent?.["DepId"] || "" },
                { title: "上層部門名稱", value: deptRow.Parent?.["DepName"] || "" },
                { title: "主管員工編號 (網家)", value: deptRow.Manager?.["EmpNo"] || "" },
                { title: "主管姓名", value: deptRow.Manager?.["Username"] || "" },
                { title: "主管職務編號", value: deptRow.Manager?.["RolId"] || "" },
            ] : [];
            beforeTable = deptRow && deptRowB4 ? [
                { value: deptRowB4["DepNo"] || "", tooltip: deptRowB4["DepId"] || "" },
                { value: deptRowB4["DepName"] || "" },
                { value: deptRowB4.Parent?.["DepNo"] || "", tooltip: deptRowB4.Parent?.["DepId"] || "" },
                { value: deptRowB4.Parent?.["DepName"] || "" },
                { value: deptRowB4.Manager?.["EmpNo"] || "" },
                { value: deptRowB4.Manager?.["Username"] || "" },
                { value: deptRowB4.Manager?.["RolId"] || "" },
            ] : [];
        }
            break;
        //人員
        case "mem": {
            title = `${props.row.EmpNo} 異動資料對比`;

            afterTable = memRow ? [
                { title: "員工編號 (網家)", value: memRow["EmpNo"] || "", tooltip: memRow["MemId"] || "" },
                { title: "員工姓名", value: memRow["Username"] || "" },
                { title: "職務編號", value: memRow["RolId"] || "" },
                { title: "部門代碼 (網家)", value: memRow.Department?.["DepNo"] || "", tooltip: memRow.Department?.["DepId"] || "" },
                { title: "部門名稱", value: memRow.Department?.["DepName"] || "" },
            ] : [];
            beforeTable = memRow && memRowB4 ? [
                { value: memRowB4["EmpNo"] || "", tooltip: memRowB4["MemId"] || "" },
                { value: memRowB4["Username"] || "" },
                { value: memRowB4["RolId"] || "" },
                { value: memRowB4.Department?.["DepNo"] || "", tooltip: memRowB4.Department?.["DepId"] || "" },
                { value: memRowB4.Department?.["DepName"] || "" },
            ] : [];
        }
            break;
    }
    //#endregion

    return (
        <>
            <Tooltip title={tooltip} placement="bottom-start" arrow>
                <Button
                    sx={buttonStyle}
                    disabled={disabled}
                    onClick={open}
                >
                    {props.value}
                </Button>
            </Tooltip>

            <MuiDialog
                open={isOpen}
                PaperProps={{
                    sx: {
                        minWidth: "50% !important",
                    },
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {/* <pre>{JSON.stringify(memRows, null, 2)}</pre> */}
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.common.white }} />
                                <TableCell sx={{ backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.common.white }}>
                                    異動後資料
                                </TableCell>
                                <TableCell sx={{ backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.common.white }}>
                                    異動前資料
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {afterTable.map((values, index) => (
                                <TableRow key={values.title} >
                                    <TableCell sx={{ width: "170px", minWidth: "170px" }}>
                                        <b>{values.title}</b>
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: "300px",
                                            minWidth: "100px",
                                            color: values.value !== beforeTable[index].value ? "red" : "inherit"
                                        }}
                                    >
                                        <Tooltip title={values.tooltip} placement="bottom-start" arrow>
                                            <span>{values.value}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                           width: "300px",
                                            minWidth: "100px"
                                        }}
                                    >
                                        <Tooltip title={beforeTable[index].tooltip} placement="bottom-start" arrow>
                                            <span>{beforeTable[index].value}</span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </MuiDialog >
        </>
    );
};

