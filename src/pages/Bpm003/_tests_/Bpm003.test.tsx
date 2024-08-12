import { faker } from "@faker-js/faker";
import nock from "nock";
import { screen, url, render } from "@tests/test-utils";
import Bpm003 from "..";
import { PageDataSchema } from "../api";

//建立 假資料
const createData = (): PageDataSchema => ({
    RowNum: faker.number.int(15),
    SyncId: faker.number.int(),
    CreatedAt: faker.date.anytime().toLocaleDateString(),
    NumberOfDepartments: faker.number.int(100),
    NumberOfMembers: faker.number.int(100),
    GeneratedAt: faker.date.anytime().toLocaleDateString(),
    SyncedAt: faker.date.anytime().toLocaleDateString(),
});

const params = { synced: 1, size: 10 };
const mockData = faker.helpers.multiple(createData, { count: 100 });

const mockRes = {
    Code: "200",
    Msg: "查詢成功",
};

describe("<Bpm003 />", () => {
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
    })
    test("change page and get Data success", async () => {
        const { user } = render(<Bpm003 />);

        nock(url)
            // 查詢組織歷程分頁資訊(10筆)
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
            // 查詢組織歷程分頁資訊(50筆)
            .get("/BpmOrgSync/Data/Info")
            .query({ ...params, size: 50 })
            .reply(200, {
                ...mockRes,
                Data: {
                    RowCount: mockData.length,
                    PageCount: Math.floor(mockData.length / params.size),
                    PageSize: 50,
                },
            })
            //初始資料(10筆)
            .get("/BpmOrgSync/Data")
            .query({ ...params, page: 1 })
            .reply(200, {
                ...mockRes,
                Data: { Page: 1, Rows: mockData.slice(0, 10), PageSize: 10 },
            })
            //第一頁
            .get("/BpmOrgSync/Data")
            .query({ ...params, size: 50, page: 1 })
            .reply(200, {
                ...mockRes,
                Data: { Page: 1, Rows: mockData.slice(0, 50), PageSize: params.size },
            })
            // 第二頁
            .get("/BpmOrgSync/Data")
            .query({ ...params, size: 50, page: 2 })
            .reply(200, {
                ...mockRes,
                Data: { Page: 2, Rows: mockData.slice(50, 100), PageSize: params.size },
            });

        expect(
            await screen.findByText(`1–10 of ${mockData.length}`)
        ).toBeInTheDocument();
        expect(await screen.findByText(mockData[0].SyncId)).toBeInTheDocument();

        // 切換成 50 筆
        await user.click(screen.getByRole("combobox", { name: /Rows per page/i }));
        await user.click(screen.getByRole("option", { name: "50" }));

        expect(
            await screen.findByText(`1–50 of ${mockData.length}`)
        ).toBeInTheDocument();
        expect(await screen.findByText(mockData[0].SyncId)).toBeInTheDocument();

        // 下一頁
        await user.click(screen.getByTestId("KeyboardArrowRightIcon"));
        expect(
            await screen.findByText(`51–100 of ${mockData.length}`)
        ).toBeInTheDocument();
        expect(await screen.findByText(mockData[50].SyncId)).toBeInTheDocument();
        expect(
            screen.getByTestId("KeyboardArrowRightIcon").parentElement
        ).toBeDisabled();
    });
});
