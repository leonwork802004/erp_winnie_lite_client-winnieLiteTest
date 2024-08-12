import { faker } from "@faker-js/faker";
import nock from "nock";
import { screen, url, render } from "@tests/test-utils";
import Bpm003Tabs from "..";
import { PageDataSchema, RootDeptLogSchema, RootMemLogSchema } from "../api";

//建立 Log主檔假資料
const createData = (): PageDataSchema => ({
    RowNum: faker.number.int(15),
    SyncId: 14,
    CreatedAt: faker.date.anytime().toLocaleDateString(),
    NumberOfDepartments: faker.number.int(100),
    NumberOfMembers: faker.number.int(100),
    GeneratedAt: faker.date.anytime().toLocaleDateString(),
    SyncedAt: faker.date.anytime().toLocaleDateString(),
});

const params = { synced: 1, size: 10 };
const mockData = faker.helpers.multiple(createData, { count: 1 });

const mockRes = {
    Code: "200",
    Msg: "查詢成功",
};

//部門假資料
const deptData: Array<RootDeptLogSchema> = [
    {
        SyncId: 14,
        Type: faker.number.int(4),
        RowNum: faker.number.int(),
        DepId: faker.string.binary({ prefix: "DEPC_", length: 10 }),
        DepNo: faker.string.binary({ prefix: "P", length: 8 }),
        DepName: faker.company.name(),
        Manager: {
            MemId: faker.string.binary({ prefix: "MEMC_", length: 10 }),
            EmpNo: faker.string.binary({ prefix: "8", length: 6 }),
            RolId: faker.string.binary({ prefix: "ROLC_", length: 10 }),
            Username: faker.person.fullName(),
        },
        Parent: {
            DepId: faker.string.binary({ prefix: "DEPC_", length: 10 }),
            DepNo: faker.string.binary({ prefix: "P", length: 8 }),
            DepName: faker.company.name(),
        },
        B4: {
            DepId: faker.string.binary({ prefix: "DEPC_", length: 10 }),
            DepNo: faker.string.binary({ prefix: "P", length: 8 }),
            DepName: faker.company.name(),
            Manager: {
                MemId: faker.string.binary({ prefix: "MEMC_", length: 10 }),
                EmpNo: faker.string.binary({ prefix: "8", length: 6 }),
                RolId: faker.string.binary({ prefix: "ROLC_", length: 10 }),
                Username: faker.person.fullName(),
            },
            Parent: {
                DepId: faker.string.binary({ prefix: "DEPC_", length: 10 }),
                DepNo: faker.string.binary({ prefix: "P", length: 8 }),
                DepName: faker.company.name(),
            },
        },
    }
];

//人員假資料
const memData: Array<RootMemLogSchema> = [
    {
        SyncId: 14,
        Type: faker.number.int(4),
        RowNum: faker.number.int(),
        MemId: faker.string.binary({ prefix: "MEMC_", length: 10 }),
        EmpNo: faker.string.binary({ prefix: "8", length: 6 }),
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
            EmpNo: faker.string.binary({ prefix: "8", length: 6 }),
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

describe("<Bpm003Tabs />", () => {
    beforeEach(() => {
        nock(url)
            .get("/BpmOrgSync/Data/Info")
            .query(params)
            .reply(200, {
                ...mockRes,
                Data: {
                    RowCount: mockData.length,
                    PageCount: Math.floor(mockData.length / params.size),
                    PageSize: params.size,
                },
            })
            .get("/BpmOrgSync/Data")
            .query({ ...params, page: 1 })
            .reply(200, {
                ...mockRes,
                Data: { Page: 1, Rows: mockData.slice(0, 10), PageSize: 10 },
            })
            .get("/BpmOrgSync/Mem/Info")
            .query(paramsTab)
            .reply(200, {
                ...mockRes,
                Data: {
                    RowCount: memData.length,
                    PageCount: Math.floor(memData.length / params.size),
                    PageSize: params.size,
                }
            })
            .get("/BpmOrgSync/Mem")
            .query({ ...paramsTab, page: 1 })
            .reply(200, {
                ...mockRes,
                Data: { Page: 1, Rows: memData, PageSize: 10 }
            })
            .get("/BpmOrgSync/Dept/Info")
            .query(paramsTab)
            .reply(200, {
                ...mockRes,
                Data: {
                    RowCount: deptData.length,
                    PageCount: Math.floor(deptData.length / params.size),
                    PageSize: params.size,
                }
            })
            .get("/BpmOrgSync/Dept")
            .query({ ...paramsTab, page: 1 })
            .reply(200, {
                ...mockRes,
                Data: { Page: 1, Rows: deptData, PageSize: 10 }
            })
    })

    test("switch tab get data", async () => {
        const { user } = render(<Bpm003Tabs />);

        //點擊row
        await user.click(await screen.findByRole("gridcell", { name: "14" }));
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
            .get("/BpmOrgSync/Dept/Info")
            .query(paramsTab)
            .reply(200, {
                ...mockRes,
                Data: {
                    RowCount: deptData.length,
                    PageCount: Math.floor(deptData.length / paramsTab.size),
                    PageSize: paramsTab.size,
                }
            })
            .get("/BpmOrgSync/Dept")
            .query({ ...paramsTab, page: 1 })
            .reply(200, {
                ...mockRes,
                Data: { Page: 1, Rows: deptData, PageSize: 10 }
            })

        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('部門');
        expect(await screen.findByText(deptData[0].DepNo!));

        //測試懸停功能
        user.hover(await screen.findByText(deptData[0].DepNo!));
        expect(await screen.findByText(deptData[0].DepId!)).toBeInTheDocument();
        user.hover(await screen.findByText(deptData[0].Parent?.DepNo || ""));
        expect(await screen.findByText(deptData[0].Parent?.DepId || "")).toBeInTheDocument();

        //切換Tab 至 人員
        const tab = screen.getByRole('tab', { name: '人員' });
        user.click(tab);
        expect(await screen.findByText(memData[0].EmpNo!)).toBeInTheDocument();

        //測試懸停功能
        user.hover(await screen.findByText(memData[0].EmpNo!));
        expect(await screen.findByText(memData[0].MemId!)).toBeInTheDocument();
        user.hover(await screen.findByText(memData[0].Department?.DepNo || ""));
        expect(await screen.findByText(memData[0].Department?.DepId || "")).toBeInTheDocument();

    })
})