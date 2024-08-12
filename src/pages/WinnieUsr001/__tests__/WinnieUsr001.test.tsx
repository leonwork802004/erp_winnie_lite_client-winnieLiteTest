import { faker } from "@faker-js/faker";
import nock from "nock";
import { queryClient } from "@lib/tanstack";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import WinnieUsr001 from "..";
import { FetchWinnieUserRes, WinnieUserSchema, unlockUserApi } from "../api";
import { buttons } from "../utils";

const featureNames = Object.values(buttons).map((button) => button.featureName);

const createData = (): WinnieUserSchema => {
  return {
    PwdModDtm: faker.date.past().toString(),
    LoginIp: faker.internet.ip(),
    Acct: faker.internet.displayName(),
    Name: faker.person.fullName(),
    Id: faker.string.uuid(),
    EmpNo: faker.string.numeric(6),
    Email: faker.internet.email(),
    DepNo: faker.person.jobType(),
    CrewNo: faker.string.alphanumeric({ length: 10, casing: "upper" }),
    Memo: faker.lorem.lines(),
    Status: faker.number.binary(),
    CreMan: faker.person.fullName(),
    CreDtm: faker.date.past().toString(),
    ModMan: faker.person.fullName(),
    ModDtm: faker.date.past().toString(),
  };
};
const mockData = faker.helpers.multiple(createData, {
  count: 10,
});

const fetchUser = vi.spyOn(unlockUserApi, "useFetchWinnieUser");

describe("<WinnieUsr001 />", () => {
  const params = {
    acct: "",
    name: "A",
    empNo: "",
    usrNo: "",
  };
  const mockRes: FetchWinnieUserRes = {
    Code: "",
    Msg: "",
    Data: mockData,
  };

  beforeEach(() => {
    mockButtonRequest(featureNames);
    nock(url).get("/winnieUser/data").query(params).reply(200, mockRes);
  });

  test("get user data - success", async () => {
    const { user } = render(<WinnieUsr001 />);

    await user.type(screen.getByLabelText("姓名"), "A");
    await user.click(screen.getByRole("button", { name: "查詢" }));

    expect(
      await screen.findByText(mockData[0].Name as string)
    ).toBeInTheDocument();
    expect(fetchUser).toHaveBeenCalledTimes(8);

    // refetch
    await user.click(screen.getByRole("button", { name: "查詢" }));
    expect(fetchUser).toHaveBeenCalledTimes(9);

    await user.clear(screen.getByRole("textbox", { name: "姓名" }));
    await user.click(screen.getByRole("button", { name: "查詢" }));
    expect(screen.getByText(/至少輸入一個查詢條件/i)).toBeInTheDocument();
  });

  test("mutate - failure", async () => {
    nock(url)
      .post("/winnieUser/unlock", {
        UsrNo: mockData[0].Id,
      })
      .reply(400, { Code: "400", Msg: "解鎖失敗，請再試一次" });

    const { user } = render(<WinnieUsr001 />);

    await user.type(screen.getByRole("textbox", { name: "姓名" }), "A");
    await user.click(screen.getByRole("button", { name: "查詢" }));

    await user.click(screen.getByRole("button", { name: "解三次錯誤" }));
    expect(screen.getByText("請選擇帳號")).toBeInTheDocument();

    await user.click(screen.getByText(mockData[0].Name as string));
    await user.click(screen.getByRole("button", { name: "解三次錯誤" }));

    expect(screen.getByText("確定執行 解三次錯誤")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(await screen.findByText("解鎖失敗，請再試一次")).toBeInTheDocument();
  });

  test("mutate - success, fetch user data after mutate", async () => {
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
    nock(url)
      .post("/winnieUser/unlock", {
        UsrNo: mockData[0].Id,
      })
      .reply(200, { Code: "200", Msg: "解鎖成功" });

    const { user } = render(<WinnieUsr001 />);

    await user.type(screen.getByRole("textbox", { name: "姓名" }), "A");
    await user.click(screen.getByRole("button", { name: "查詢" }));

    await user.click(await screen.findByText(mockData[0].Name as string));
    await user.click(screen.getByRole("button", { name: "解三次錯誤" }));

    expect(screen.getByText("確定執行 解三次錯誤")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(await screen.findByText("解鎖成功")).toBeInTheDocument();
    expect(invalidateQueries).toHaveBeenCalledTimes(1);
  });
});
