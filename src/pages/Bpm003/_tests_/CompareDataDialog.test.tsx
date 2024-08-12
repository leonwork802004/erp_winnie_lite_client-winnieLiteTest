import { faker } from "@faker-js/faker";
import nock from "nock";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { screen, url, render } from "@tests/test-utils";
import { RootMemLogSchema } from "../api";
import { CompareDataDialog } from "../components";

//類型
const types = [
    { key: 1, value: "新增" },
    { key: 2, value: "異動" },
    { key: 3, value: "歷史" },
    { key: 4, value: "復原" },
]

const mockRes = {
    Code: "200",
    Msg: "查詢成功",
};


//人員假資料
const memData: Array<RootMemLogSchema> = [
    {
        SyncId: 14,
        Type: 2,
        RowNum: faker.number.int(),
        MemId: faker.string.binary({ prefix: "MEMC_", length: 10 }),
        EmpNo: "800000",
        RolId: faker.string.binary({ prefix: "ROLC_", length: 10 }),
        Username: faker.person.fullName(),
        Department: {
            DepId: faker.string.binary({ prefix: "DEPC_", length: 10 }),
            DepNo: faker.string.binary({ prefix: "P", length: 8 }),
            DepName: faker.company.name(),
        },
        B4: {
            SyncId: faker.number.int(),
            Type: faker.number.int(4),
            RowNum: faker.number.int(),
            MemId: faker.string.binary({ prefix: "MEMC_", length: 10 }),
            EmpNo: "800001",
            RolId: faker.string.binary({ prefix: "ROLC_", length: 10 }),
            Username: faker.person.fullName(),
            Department: {
                DepId: faker.string.binary({ prefix: "DEPC_", length: 10 }),
                DepNo: faker.string.binary({ prefix: "P", length: 8 }),
                DepName: faker.company.name(),
            },
        },
    }
];

const paramsTab = { syncId: memData[0].SyncId, size: 10 };

const mockParams: GridRenderCellParams = {
    id: 1,
    field: 'Type',
    value: '異動',
    row: {
        Type: '異動',
        MemId: memData[0].MemId!,
        EmpNo: memData[0].EmpNo!,
    },
    rowNode: {} as GridTreeNodeWithRender,
    colDef: {
        field: 'Type',
        headerName: '類型',
        minWidth: 100,
        resizable: false,
        type: 'singleSelect',
        renderCell: (params) => (
            <CompareDataDialog
                props={params} type="mem" dataPayload={paramsTab}
            />
        ),
        valueGetter: (_value, row) => {
            return types.find((type) => type.key === row.Type)?.value;
        },
        valueOptions: types.map(type => type.value),
        computedWidth: 200
    },
    cellMode: "view",
    api: {} as any,
    hasFocus: false,
    tabIndex: -1,
};

describe("<CompareDataDialog />", async () => {
    beforeEach(() => {
        nock(url)
            .get("/BpmOrgSync/Mem/Info")
            .query(paramsTab)
            .reply(200, {
                ...mockRes,
                Data: {
                    RowCount: memData.length,
                    PageCount: Math.floor(memData.length / paramsTab.size),
                    PageSize: paramsTab.size,
                }
            })
            .get("/BpmOrgSync/Mem")
            .query({ ...paramsTab, page: 1 })
            .reply(200, {
                ...mockRes,
                Data: { Page: 1, Rows: memData, PageSize: 10 }
            })
    })

    test('opens the dialog when clicked', async () => {
        const { user } = render(<CompareDataDialog props={mockParams} type={"mem"} dataPayload={{ ...paramsTab, page: 1 }} />);

        //測試懸浮功能
        const button = await screen.findByText("異動");
        user.hover(button);
        expect(await screen.findByText("查看異動資料對比")).toBeInTheDocument();

        //彈跳視窗 內容
        user.click(button);
        expect(await screen.findByRole("dialog")).toBeVisible();
        expect(await screen.findByText(memData[0].EmpNo + " 異動資料對比")).toBeInTheDocument();
    
    });

    test('get Abn data , differences text color will be red', async () => {
        const { user } = render(<CompareDataDialog props={mockParams} type={"mem"} dataPayload={{ ...paramsTab, page: 1 }} />);

        nock(url)
            .get("/BpmOrgSync/Mem/Info")
            .query(paramsTab)
            .reply(200, {
                ...mockRes,
                Data: {
                    RowCount: memData.length,
                    PageCount: Math.floor(memData.length / paramsTab.size),
                    PageSize: paramsTab.size,
                }
            })
            .get("/BpmOrgSync/Mem")
            .query({ ...paramsTab, page: 1 })
            .reply(200, {
                ...mockRes,
                Data: { Page: 1, Rows: memData, PageSize: 10 }
            })

        //測試懸浮功能
        const button = await screen.findByText("異動");

        //彈跳視窗 內容
        user.click(button);
        expect(await screen.findByText("異動後資料")).toBeInTheDocument();

        //測試懸浮功能
        user.hover(await screen.findByText(memData[0].EmpNo!));
        expect(await screen.findByText(memData[0].MemId!)).toBeInTheDocument();
        user.hover(await screen.findByText(memData[0].Department?.DepNo || ""));
        expect(await screen.findByText(memData[0].Department?.DepId || "")).toBeInTheDocument();

        //測試 異動後資料與異動前資料不同 異動後字體顏色為紅色 異動前為黑色
        expect(await screen.findByText(memData[0].EmpNo!)).toHaveStyle(`color: rgb(255, 0, 0)`);
        expect(await screen.findByText(memData[0].B4?.EmpNo || "")).toHaveStyle(`color: rgba(0, 0, 0, 0.87)`);
    })
})