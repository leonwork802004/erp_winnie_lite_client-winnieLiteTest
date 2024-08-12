import { Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useTableSelected } from "@hooks/useTableSelected";
import { ConnResSchema, getSiteContentApi } from "../api";
import { ConnResButton } from "./ConnResButton";

export const SiteContent = () => {
    const { data } = getSiteContentApi.useFetchSiteContent();
    const tableContent = [
        { title: "系統資訊", value: data?.Data.OSName },
        { title: "程式名稱", value: data?.Data.AppName },
        { title: "程式路徑", value: data?.Data.AppPath },
        { title: "Log路徑", value: data?.Data.LogPath },
    ];

    const { handleSelectedClick } =
        useTableSelected<ConnResSchema | null>();

    return (
        <>
            <Typography variant="subtitle1" mb={1} fontWeight="bold" display={"flex"}>
                <svg width="15" height="25" >
                    <rect width="8" height="25" fill="#1976d2" rx="0" ry="0"></rect></svg>
                測試功能
            </Typography>
            <Stack
                direction="row"
                spacing={{ xs: 2 }}
                useFlexGap
                flexWrap="wrap"
                marginLeft="20px"
                alignItems="center"
            >
                <Table size="small">
                    <TableBody>
                        {tableContent.map((values) =>
                            <TableRow
                                key={values.title}>
                                <TableCell component="th" scope="row" sx={{ border: 0 }}>
                                    <b>{values.title}：</b>
                                    {values.value}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ConnResButton
                    handleSelectedChange={handleSelectedClick}
                />
            </Stack>
        </>
    )
};