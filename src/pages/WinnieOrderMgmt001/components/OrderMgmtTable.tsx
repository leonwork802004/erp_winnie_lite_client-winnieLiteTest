import { memo, useState } from "react";
import { Stack, Tab, Tabs } from "@mui/material";
import { TabPanel, Table, TableColumn } from "@components/Elements";
import {
  DelInfoSchema,
  OrdInfoSchema,
  OrderDispatchEndpoint,
  PickInfoSchema,
  PoolInfoSchema,
  ProjectInfoSchema,
  StockInfoSchema,
  TrfInfoSchema,
  TrfModeSchema,
  useGetOrderDispatchData,
} from "../api";

type Props = {
  ordId: string;
};

// tab 頁籤
const tabs = [
  "訂單資訊",
  "撿貨資訊",
  "調撥模式",
  "調撥單狀態",
  "商品庫存資料",
  "刪單資訊",
  "工程資訊",
  "派單資訊",
];

export const OrderMgmtTable = memo(({ ordId }: Props) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  //#region 訂單資訊
  const { data: orderInfos } = useGetOrderDispatchData(
    OrderDispatchEndpoint.OrderInfos,
    ordId
  );
  //#endregion

  //#region 調撥模式
  const { data: trfMode } = useGetOrderDispatchData(
    OrderDispatchEndpoint.TrfMode,
    ordId
  );
  //#endregion

  //#region 揀貨資訊
  const { data: pickInfos } = useGetOrderDispatchData(
    OrderDispatchEndpoint.PickInfos,
    ordId
  );
  //#endregion

  //#region 刪單資訊
  const { data: delInfos } = useGetOrderDispatchData(
    OrderDispatchEndpoint.DelInfos,
    ordId
  );
  //#endregion

  //#region 調撥單狀態
  const { data: trfInfos } = useGetOrderDispatchData(
    OrderDispatchEndpoint.TrfInfos,
    ordId
  );
  //#endregion

  //#region 商品庫存資料
  const { data: stockInfos } = useGetOrderDispatchData(
    OrderDispatchEndpoint.StockInfos,
    ordId
  );
  //#endregion

  //#region 工程資訊
  const { data: projectInfos } = useGetOrderDispatchData(
    OrderDispatchEndpoint.ProjectInfos,
    ordId
  );
  //#endregion

  //#region 派單 pool 資訊
  const { data: poolInfos } = useGetOrderDispatchData(
    OrderDispatchEndpoint.PoolInfos,
    ordId
  );
  //#endregion

  return (
    <Stack height={"100%"}>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 1 }}
      >
        {tabs.map((tab) => (
          <Tab key={tab} label={tab} />
        ))}
      </Tabs>

      {/* 訂單資訊 */}
      <TabPanel index={0} value={tabValue}>
        <Table data={orderInfos?.Data} columns={ordInfoColumns} />
      </TabPanel>

      {/* 揀貨資訊 */}
      <TabPanel index={1} value={tabValue}>
        <Table data={pickInfos?.Data} columns={pickInfoColumns} />
      </TabPanel>

      {/* 調撥模式 */}
      <TabPanel index={2} value={tabValue}>
        <Table data={trfMode?.Data} columns={TrfModeColumns} />
      </TabPanel>

      {/* 調撥單狀態 */}
      <TabPanel index={3} value={tabValue}>
        <Table data={trfInfos?.Data} columns={trfInfoColumns} />
      </TabPanel>

      {/* 商品庫存資料 */}
      <TabPanel index={4} value={tabValue}>
        <Table data={stockInfos?.Data} columns={stockColumns} />
      </TabPanel>

      {/* 刪單資訊 */}
      <TabPanel index={5} value={tabValue}>
        <Table data={delInfos?.Data} columns={delInfoColumns} />
      </TabPanel>

      {/* 工程資訊 */}
      <TabPanel index={6} value={tabValue}>
        <Table data={projectInfos?.Data} columns={projectInfoColumns} />
      </TabPanel>

      {/* 派單資訊 */}
      <TabPanel index={7} value={tabValue}>
        <Table data={poolInfos?.Data} columns={poolInfoColumns} />
      </TabPanel>
    </Stack>
  );
});

//#region 訂單資訊
const ordInfoColumns: TableColumn<OrdInfoSchema>[] = [
  { title: "預設庫別", field: "ItemWh" },
  { title: "商品狀態", field: "ProdStatus", width: 160 },
  { title: "目前狀態", field: "CurStatus" },
  { title: "訂單類型", field: "OrdType" },
  { title: "訂單編號", field: "OrdId", width: 150 },
  { title: "訂序", field: "OrdNo" },
  { title: "預購", field: "Executor" },
  { title: "訂單時間", field: "OrdDtm", width: 170 },
  { title: "轉單時間", field: "TrfDtm", width: 170 },
  { title: "出貨庫別", field: "OrdWh" },
  { title: "商品ID", field: "ProdId", width: 150 },
  { title: "商品名稱", field: "ProdName", width: 150 },
  { title: "訂單未出量", field: "ShipQty" },
  { title: "有效揀貨量", field: "PickQty" },
  { title: "可賣好揀庫存", field: "SellQty" },
  { title: "可賣不好揀庫存", field: "SellHighQty" },
  { title: "出貨否", field: "ShipChk" },
  { title: "訂單明細狀態", field: "OrdStatus" },
  { title: "退貨明細狀態", field: "OrdBakStatus" },
  { title: "預購出貨日", field: "PreShipDt", width: 170 },
  { title: "訂購商品數量", field: "ProdQty" },
  { title: "派單池塘數量", field: "Stk24Qty" },
  { title: "調撥預購池塘數量", field: "ZmQty" },
  { title: "寄倉", field: "HaveSup" },
  { title: "指定出貨日", field: "SetShipDt", width: 170 },
  { title: "約定日", field: "AgrDt", width: 170 },
  { title: "出貨日", field: "ShipDt", width: 170 },
  { title: "訂單狀態", field: "MainStatus" },
  { title: "退貨狀態", field: "MainBakStatus" },
  { title: "派單狀態", field: "IsBook" },
  { title: "重派狀態", field: "BookFail" },
];
//#endregion

//#region 調撥模式
const TrfModeColumns: TableColumn<TrfModeSchema>[] = [
  { title: "調撥模式", field: "Mode" },
  { title: "調撥訂編", field: "OrdId", width: 150 },
  { title: "訂序", field: "OrdNo" },
  { title: "來源庫", field: "Wh" },
  { title: "需求庫", field: "OrdWh" },
  { title: "商品ID", field: "ProdId", width: 180 },
  { title: "需求數量", field: "ProdQty" },
  { title: "完成數量", field: "ZmQty" },
  { title: "開始時間", field: "BeginDtm", width: 170 },
  { title: "確認完成時間", field: "ChkDtm", width: 170 },
];
//#endregion

//#region 揀貨資訊
const pickInfoColumns: TableColumn<PickInfoSchema>[] = [
  { title: "揀貨訂編", field: "OrdId", width: 150 },
  { title: "訂序", field: "OrdNo" },
  { title: "揀貨庫別", field: "PickWh" },
  { title: "撿貨狀態", field: "PickStatus" },
  { title: "集貨場", field: "PickGift" },
  { title: "揀貨單號", field: "PickId", width: 150 },
  { title: "揀貨序號", field: "PickNo" },
  { title: "揀貨數量", field: "PickQty" },
  { title: "商品編號", field: "ProdId", width: 180 },
  { title: "商品名稱", field: "ProdName", width: 180 },
  { title: "建檔時間", field: "KeyinDtm", width: 170 },
  { title: "印揀貨單時間", field: "PickDtm", width: 170 },
  { title: "出貨時間", field: "OutDtm", width: 170 },
  { title: "CP", field: "Cp" },
  { title: "CP時間", field: "CpDtm", width: 170 },
];
//#endregion

//#region 刪單資訊
const delInfoColumns: TableColumn<DelInfoSchema>[] = [
  { title: "刪單原因", field: "Mark" },
  { title: "訂序", field: "OrdNo" },
  { title: "揀貨庫別", field: "PickWh" },
  { title: "揀貨狀態", field: "PickStatus" },
  { title: "集貨場", field: "PickGift" },
  { title: "揀貨單號", field: "PickId", width: 160 },
  { title: "揀貨序號", field: "PickNo" },
  { title: "揀貨數量", field: "PickQty" },
  { title: "商品編號", field: "ProdId", width: 160 },
  { title: "商品名稱", field: "ProdName", width: 160 },
  { title: "建檔時間", field: "KeyinDtm", width: 170 },
  { title: "印揀貨單時間", field: "PickDtm", width: 170 },
  { title: "出庫時間", field: "OutDtm", width: 170 },
  { title: "CP", field: "Cp" },
  { title: "CP時間", field: "CpDtm", width: 170 },
];
//#endregion

//#region 調撥單狀態
const trfInfoColumns: TableColumn<TrfInfoSchema>[] = [
  { title: "調撥單號", field: "TrfId", width: 160 },
  { title: "調撥訂編", field: "OrdId", width: 150 },
  { title: "來源庫", field: "Wh" },
  { title: "調到這庫", field: "DstWh" },
  { title: "調撥狀態", field: "Status" },
  { title: "商品ID", field: "ProdId", width: 180 },
  { title: "調撥商品名稱", field: "ProdName", width: 180 },
  { title: "申請數量", field: "AdvQty" },
  { title: "調撥開始時間", field: "ActDtm", width: 170 },
  { title: "調撥上架時間", field: "InDtm", width: 170 },
  { title: "調撥完成時間", field: "DoneDtm", width: 170 },
  { title: "調撥完成原因", field: "DoneCause", width: 150 },
];
//#endregion

//#region 商品庫存資料
const stockColumns: TableColumn<StockInfoSchema>[] = [
  { title: "庫別代碼", field: "Wh" },
  { title: "庫別名稱", field: "WhName", width: 150 },
  { title: "商品ID", field: "ProdId", width: 160 },
  { title: "商品名稱", field: "ProdName", width: 160 },
  { title: "訂單需求", field: "NeedQty" },
  { title: "實際庫存(好撿)", field: "StockQty" },
  { title: "實際庫存(高棧板)", field: "StockHighQty" },
  { title: "可派庫存(好撿)", field: "Qty" },
  { title: "可派庫存(高棧板)", field: "HighQty" },
];
//#endregion

//#region 工程資訊
const projectInfoColumns: TableColumn<ProjectInfoSchema>[] = [
  { title: "訂單編號", field: "OrdId", width: 150 },
  { title: "紀錄時間", field: "ModDtm", width: 170 },
  { title: "備註1", field: "Memo1" },
  { title: "備註2", field: "Memo2" },
  { title: "備註3", field: "Memo3" },
];
//#endregion

//#region 派單 pool 資訊
const poolInfoColumns: TableColumn<PoolInfoSchema>[] = [
  { title: "訂編", field: "OrdId", width: 150 },
  { title: "訂序", field: "OrdNo" },
  { title: "庫別", field: "Wh" },
  { title: "商品ID", field: "ProdId", width: 150 },
  { title: "派單數量", field: "Qty" },
  { title: "待出貨狀態", field: "TrfStatus" },
  { title: "出貨狀態", field: "ShipStatus" },
  { title: "建檔時間", field: "CreDtm", width: 170 },
];
//#endregion
