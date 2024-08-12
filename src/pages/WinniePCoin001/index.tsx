import SearchIcon from "@mui/icons-material/Search";
import { MenuItem, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, Item } from "@components/Elements";
import { UserButton } from "@features/userButton";
import {
  GetPCoinActDataPayload,
  PCoinDataSchema,
  useGetActStatusMapping,
} from "./api";
import { buttons } from "./utils";

const defaultValue: GetPCoinActDataPayload = {
  begin: null,
  end: null,
  status: "",
  id: "",
};

const WinniePCoin001 = () => {
  const { data: statusMapping } = useGetActStatusMapping();

  // const handleDateChange = useCallback(
  //   (value: Dayjs | null, field: "begin" | "end") => {
  //     const dateValue = dayjs(value).isValid()
  //       ? dayjs(value).format("YYYY/MM/DD")
  //       : null;
  //   },
  //   []
  // );

  // const handleGetData = () => {
  //   if (!input.begin && !input.end && !input.id.trim()) {
  //     toast.error("請輸入活動日期區間或是活動 ID");
  //     return;
  //   }
  //   if (input.begin && input.end && input.begin > input.end) {
  //     toast.error("起始日期不能大於終止日期");
  //     return;
  //   }
  // };

  return (
    <Grid container spacing={2} direction={"row"} p={2}>
      <Grid item xs={2.5}>
        <Item>
          <Stack spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={1} direction={{ xs: "row", md: "column" }}>
                <DatePicker label="開始日期" />
                <DatePicker label="結束日期" />
              </Stack>
            </LocalizationProvider>

            <Stack spacing={2} direction={"column"}>
              {statusMapping && (
                <TextField
                  name="status"
                  select
                  fullWidth
                  label="活動狀態"
                  size="small"
                >
                  {statusMapping.Data.map((option) => (
                    <MenuItem key={option.Key} value={option.Key}>
                      {option.Display}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <TextField name="id" fullWidth label="活動ID" size="small" />
            </Stack>
          </Stack>
        </Item>
      </Grid>

      <Grid item xs={9.5} container direction={"column"}>
        <Grid item xs="auto" pb={2}>
          <Item>
            <Stack direction={"row"} spacing={1}>
              <UserButton
                featureName={buttons.qry}
                startIcon={<SearchIcon />}
                variant="outlined"
              >
                查詢
              </UserButton>

              {/* <ReleaseDialog
                {...pick(selected, "ActId", "ActStatus")}
                getDataPayload={payload}
              /> */}
            </Stack>
          </Item>
        </Grid>

        <Grid item xs container>
          <Item>
            <DataGrid
              columns={columns}
              sx={{
                height: "calc(100dvh - 164px)",
              }}
            />
          </Item>
        </Grid>
      </Grid>
    </Grid>
  );
};

const columns: GridColDef<PCoinDataSchema>[] = [
  { headerName: "活動ID", field: "ActId", width: 140 },
  { headerName: "狀態", field: "ActStatus" },
  { headerName: "放行狀態", field: "StatusDetail" },
  { headerName: "放行/退回原因", field: "IofMemo", width: 170 },
  { headerName: "活動名稱", field: "ActName", width: 170 },
  { headerName: "活動開始日期", field: "ActBeginDt", width: 170 },
  { headerName: "活動結束日期", field: "ActEndDt", width: 170 },
  { headerName: "組別", field: "DpmName", width: 120 },
  { headerName: "預估贈點點數", field: "EstAmt" },
  { headerName: "預估贈點筆數", field: "EstCnt" },
  { headerName: "實際贈點點數", field: "AtlAmt" },
  { headerName: "實際贈點筆數", field: "AtlCnt" },
  { headerName: "P幣支付比例", field: "PaymentRatio" },
  { headerName: "費用支付對象", field: "FeePaymentName" },
  { headerName: "贈送點數限制", field: "SendLimlt" },
  { headerName: "預計業績成長", field: "SalesGrow" },
  { headerName: "支付金額(PM填)", field: "PayAmount" },
  { headerName: "達成比例 %", field: "AchievingRate" },
  { headerName: "科長放行人", field: "ScCheck" },
  { headerName: "處長放行人", field: "DgCheck" },
  { headerName: "部長放行人", field: "MsCheck" },
  { headerName: "部長放行時間", field: "MsCheckTime", width: 170 },
];

export default WinniePCoin001;
