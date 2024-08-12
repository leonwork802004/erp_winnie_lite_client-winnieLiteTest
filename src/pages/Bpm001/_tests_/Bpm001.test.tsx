import { faker } from "@faker-js/faker";
import nock from "nock";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import Bpm001 from "..";
import { DepSchema, FetchDepResponse, getDepApi } from "../api";
import { buttons } from "../utils";

const featureNames = Object.values(buttons).map((button) => button.featureName);

const createData = (): DepSchema => {
  return {
    DepId: faker.string.nanoid(),
    DepNo: faker.string.nanoid(),
    DepName: faker.company.name(),
    DepManagerUserName: faker.person.fullName(),
    ParentDepId: faker.string.nanoid(),
    ParentDepNo: faker.string.nanoid(),
    ParentDepName: faker.company.name(),
    ParentManagerUserName: faker.person.fullName(),
  };
};
const mockData = faker.helpers.multiple(createData, {
  count: 5,
});
const mockRes: FetchDepResponse = {
  Code: "200",
  Msg: "OK",
  Data: mockData,
};

describe("<Bpm001 />", () => {
  const params = {
    depNo: "",
    depNameLike: "A",
    exclHist: 0,
  };

  beforeEach(() => {
    mockButtonRequest(Object.values(featureNames));
  });

  test("get user data - success", async () => {
    const { user } = render(<Bpm001 />);
    const fetchDep = vi.spyOn(getDepApi, "useFetchDep");
    const searchBtn = await screen.findByRole("button", { name: "查詢" });

    //測試api資料
    nock(url).get("/BpmDep/Data").query(params).reply(200, mockRes);

    await user.type(screen.getByLabelText("部門名稱"), params.depNameLike);
    await user.click(searchBtn);

    //判斷是否有正確取到值
    expect(
      await screen.findByRole("cell", { name: `${mockData[0].DepName}` })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: `${mockData[1].DepName}` })
    ).toBeInTheDocument();

    //點擊查詢按鈕 function是否有被呼叫
    await user.type(screen.getByLabelText("部門名稱"), params.depNameLike);
    await user.click(searchBtn);
    expect(fetchDep).toHaveBeenCalled();
    expect(fetchDep).toHaveReturned();

    // refetch
    await user.click(await screen.findByRole("button", { name: "查詢" }));
    expect(fetchDep).toHaveBeenCalledTimes(12);
  });

  //無輸入參數 回傳錯誤 "至少輸入一個查詢條件"
  test("get data - no parameters entered", async () => {
    const { user } = render(<Bpm001 />);

    await user.clear(screen.getByRole("textbox", { name: "部門名稱" }));
    await user.clear(screen.getByRole("textbox", { name: "部門代號(網家)" }));
    await user.click(await screen.findByRole("button", { name: "查詢" }));

    expect(
      await screen.findByText(/至少輸入一個查詢條件/i)
    ).toBeInTheDocument();
  });

  //無查詢到資料 回傳 "查無此部門"
  test("get data - no dept found", async () => {
    const { user } = render(<Bpm001 />);

    await user.type(screen.getByLabelText("部門名稱"), "AAAAA");
    await user.click(await screen.findByRole("button", { name: "查詢" }));

    setTimeout(() => {
      expect(screen.getByText(/查無此部門/i)).toBeInTheDocument();
    }, 2000);
  });

  //檢查畫面元件是否存在
  test("ui exist", async () => {
    render(<Bpm001 />);

    const inputs = await screen.findAllByRole("textbox");
    const button = await screen.findByRole("button", { name: "查詢" });
    expect(inputs.length).toBe(2);
    expect(button).toBeInTheDocument();
  });
});
