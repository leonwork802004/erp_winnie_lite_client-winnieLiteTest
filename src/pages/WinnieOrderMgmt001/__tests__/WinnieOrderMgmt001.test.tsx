import nock from "nock";
import { BaseResponse } from "@appTypes/baseResponse";
import { queryClient } from "@lib/tanstack";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import WinnieOrderMgmt001 from "..";
import { GetModeMappingRes } from "../api";
import { buttons } from "../utils";

const divId = "20200227206354";

describe("<WinnieOrderMgmt001 />", () => {
  beforeEach(() => {
    mockButtonRequest([buttons.enforceDiv, buttons.div, buttons.qry]);
    const mockRes: GetModeMappingRes = {
      Code: "",
      Msg: "",
      Data: [{ Key: "1", Display: "test" }],
    };
    nock(url).get("/OrderDispatch/ModeMapping").reply(200, mockRes);
  });

  test("execute div - success", async () => {
    const mockRes: BaseResponse = {
      Code: "200",
      Msg: "派單成功",
    };
    nock(url)
      .post("/OrderDispatch/Execute")
      .query({ ordId: divId })
      .reply(200, mockRes);

    const { user } = render(<WinnieOrderMgmt001 />);
    await user.type(screen.getByLabelText("需派入訂單編號"), divId);
    await user.click(screen.getByRole("button", { name: "直接派單" }));

    expect(await screen.findByText("執行完成!")).toBeInTheDocument();
  });

  test("execute div - failed and show failed data", async () => {
    const mockRes: BaseResponse = {
      Code: "400",
      Msg: "不需要派單",
    };

    nock(url)
      .post("/OrderDispatch/Execute")
      .query({ ordId: divId })
      .reply(400, mockRes);

    const { user } = render(<WinnieOrderMgmt001 />);
    await user.type(screen.getByLabelText("需派入訂單編號"), divId);
    await user.click(screen.getByRole("button", { name: "直接派單" }));

    expect(await screen.findByText("執行完成!")).toBeInTheDocument();
    expect(
      await screen.findByLabelText("重派失敗訂單編號如下")
    ).toHaveTextContent(`${divId} ${mockRes.Msg}`);
  });

  test("execute div - execute twice and all failed", async () => {
    const divId2 = "20200227206367";
    const mockRes: BaseResponse = {
      Code: "400",
      Msg: "不需要派單",
    };

    nock(url)
      .post("/OrderDispatch/Execute")
      .query({ ordId: divId })
      .reply(400, mockRes)
      .post("/OrderDispatch/Execute")
      .query({ ordId: divId2 })
      .reply(400, mockRes);

    const { user } = render(<WinnieOrderMgmt001 />);
    await user.type(
      screen.getByLabelText("需派入訂單編號"),
      `${divId}\n${divId2}`
    );
    await user.click(screen.getByRole("button", { name: "直接派單" }));

    expect(await screen.findByText("執行完成!")).toBeInTheDocument();
    expect(
      await screen.findByLabelText("重派失敗訂單編號如下")
    ).toHaveTextContent(`${divId} ${mockRes.Msg} ${divId2} ${mockRes.Msg}`);
  });

  test("enforce div - show error msg if mode is null", async () => {
    const { user } = render(<WinnieOrderMgmt001 />);
    await user.click(await screen.findByRole("button", { name: "重整派單" }));
    expect(screen.getByText("請選擇派單模式")).toBeInTheDocument();
  });

  test("qry - show error msg if input is null", async () => {
    const { user } = render(<WinnieOrderMgmt001 />);
    await user.click(await screen.findByTestId("SearchIcon"));
    expect(screen.getByText("請輸入訂單編號")).toBeInTheDocument();
  });

  test("qry - show error msg if id is not number", async () => {
    const { user } = render(<WinnieOrderMgmt001 />);
    await user.type(screen.getByLabelText("訂單編號"), "asd");
    await user.click(screen.getByTestId("SearchIcon"));
    expect(screen.getByText("訂單編號有誤")).toBeInTheDocument();
  });

  test("qry - call invalidateQueries if input and payload is equal", async () => {
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
    const { user } = render(<WinnieOrderMgmt001 />);
    await user.type(screen.getByLabelText("訂單編號"), "123");
    await user.click(screen.getByTestId("SearchIcon"));
    await user.click(screen.getByTestId("SearchIcon"));
    expect(invalidateQueries).toHaveBeenCalledTimes(1);
  });
});
