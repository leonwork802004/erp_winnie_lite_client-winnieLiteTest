import { faker } from "@faker-js/faker";
import nock from "nock";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import Perm002 from "..";
import { PermissionType } from "../api";
import { buttons } from "../utils";

const createData = (): PermissionType.PageDataSchema => ({
  Id: faker.number.int(),
  Title: faker.lorem.word(),
  Type: faker.number.int({ min: 1, max: 2 }),
  LinkId: faker.number.int(10),
  Status: faker.number.int(1),
  RowNum: faker.number.int(10),
});
const mockRes = {
  Code: "200",
  Msg: "查詢成功",
};

describe("<Perm002 />", () => {
  test("change page and get data success", async () => {
    const params = { auth: " ", status: " ", size: 100 };
    const mockData = faker.helpers.multiple(createData, { count: 100 });

    mockButtonRequest(Object.values(buttons));
    nock(url)
      // 查詢權限分頁資訊(100筆)
      .get("/permission/data/info")
      .query(params)
      .reply(200, {
        ...mockRes,
        Data: {
          RowCount: mockData.length,
          PageCount: Math.floor(mockData.length / params.size),
          PageSize: params.size,
        },
      })
      // 查詢權限分頁資訊(25筆)
      .get("/permission/data/info")
      .query({ ...params, size: 25 })
      .reply(200, {
        ...mockRes,
        Data: {
          RowCount: mockData.length,
          PageCount: Math.floor(mockData.length / params.size),
          PageSize: 25,
        },
      })
      // 初始資料(100筆)
      .get("/permission/data")
      .query({ ...params, page: 1 })
      .reply(200, {
        ...mockRes,
        Data: { Page: 1, Rows: mockData, PageSize: 100 },
      })
      // 第一頁
      .get("/permission/data")
      .query({ ...params, size: 25, page: 1 })
      .reply(200, {
        ...mockRes,
        Data: { Page: 1, Rows: mockData.slice(0, 25), PageSize: params.size },
      })
      // 第二頁
      .get("/permission/data")
      .query({ ...params, size: 25, page: 2 })
      .reply(200, {
        ...mockRes,
        Data: { Page: 2, Rows: mockData.slice(25, 50), PageSize: params.size },
      });

    const { user } = render(<Perm002 />);
    expect(
      await screen.findByText(`1–100 of ${mockData.length}`)
    ).toBeInTheDocument();
    expect(await screen.findByText(mockData[0].Title)).toBeInTheDocument();
    expect(
      screen.getByTestId("KeyboardArrowRightIcon").parentElement
    ).toBeDisabled();

    // 切換成 25 筆
    await user.click(screen.getByRole("combobox", { name: /Rows per page/i }));
    await user.click(screen.getByRole("option", { name: "25" }));

    expect(
      await screen.findByText(`1–25 of ${mockData.length}`)
    ).toBeInTheDocument();
    expect(await screen.findByText(mockData[0].Title)).toBeInTheDocument();

    // 下一頁
    await user.click(screen.getByTestId("KeyboardArrowRightIcon"));
    expect(
      await screen.findByText(`26–50 of ${mockData.length}`)
    ).toBeInTheDocument();
    expect(await screen.findByText(mockData[25].Title)).toBeInTheDocument();
  });
});
