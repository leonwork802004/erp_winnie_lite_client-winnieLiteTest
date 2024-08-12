import { Grid, Stack, Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { Item, Table, TableColumn } from "@components/Elements";
import { useFetchUserPage } from "@features/userButton";
import { ConnResSchema, getConnResApi } from "./api";
import { Bpm002Buttons, SiteContent } from "./components";
import { buttons } from "./utils";

const Bpm002 = () => {
    const connResData = getConnResApi.useFetchConnRes().data;
    const connResColumns: TableColumn<ConnResSchema>[] = [
        { title: "站台名稱", field: "Name", width: 200 },
        { title: "站台路徑", field: "Url", width: 600 },
        {
            title: "回應碼",
            field: "Code",
            Cell({ entry: { Code } }) {
                let fontColor = "";
                if (Code >= 200 && Code <= 299) {
                    fontColor = green[500];
                } else {
                    fontColor = red[500];
                }

                return (
                    <>
                        {fontColor && (
                            <Typography
                                color={fontColor}
                                fontSize="14px">
                                {Code}
                            </Typography>
                        )}
                    </>
                );
            },
        },
        { title: "回應訊息", field: "Content", width: 400, isSortLabel: false },
    ];

    //Table與測試站台連線 權限同步 顯示/隱藏
    function ShowConnRes() {
        const { qryConnRes } = buttons;
        const { data } = useFetchUserPage(qryConnRes.featureName.split("_")[0]);
        if (data?.featureNames.includes(qryConnRes.featureName)) {
            return (
                <Table<ConnResSchema>
                    data={connResData?.Data}
                    columns={connResColumns}
                />
            )
        }
    }

    return (
        <Grid
            container
            spacing={{ xs: 1, md: 2 }}
            height="100%"
            direction={{ xs: "column", md: "row" }}
            p={2}
        >
            <Grid item md xs>
                <Stack spacing={{ xs: 1, md: 2 }} height={"100%"}>
                    <Item sx={{ height: "auto" }}>
                        <Stack direction={"row"} spacing={1}>
                            <Bpm002Buttons />
                        </Stack>
                    </Item>
                    <Item sx={{ height: "auto" }}>
                        <SiteContent />
                    </Item>
                    <ShowConnRes />
                </Stack>
            </Grid>
        </Grid>
    )
};

export default Bpm002;