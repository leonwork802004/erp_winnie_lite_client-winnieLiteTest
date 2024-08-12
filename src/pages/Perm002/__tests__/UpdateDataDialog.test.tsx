import nock from "nock";
import { BaseResponse } from "@appTypes/baseResponse";
import { queryClient } from "@lib/tanstack";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import { PermissionType } from "../api";
import { UpdateDataDialog } from "../components";
import { buttons } from "../utils";

const data: PermissionType.PageDataSchema = {
  Id: 3,
  Title: "測試權限",
  Type: 1,
  LinkId: 3,
  Status: 1,
  RowNum: 3,
};
const cmd = { Title: "測試權限123", Status: 1 };

const renderUpdateDataDialog = () =>
  render(<UpdateDataDialog data={data} fetchDataPayload={{}} />);

describe("<UpdateDataDialog />", () => {
  beforeEach(() => {
    mockButtonRequest([buttons.modify]);
  });

  test("render success", async () => {
    const { user } = renderUpdateDataDialog();
    await user.click(await screen.findByRole("button"));

    expect(
      screen.getByRole("dialog", { name: "更新權限資料" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "權限名稱、說明" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "權限狀態" })
    ).toBeInTheDocument();
  });

  test("Title null", async () => {
    const { user } = renderUpdateDataDialog();
    await user.click(await screen.findByRole("button"));

    await user.clear(screen.getByRole("textbox"));
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(screen.getByText("請輸入權限名稱")).toBeInTheDocument();
  });

  test("submit data success", async () => {
    const { user } = renderUpdateDataDialog();

    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
    const response: PermissionType.UpdateDataResponse = {
      Code: "200",
      Msg: "修改成功",
      Data: 1,
    };

    const scope = nock(url)
      .patch("/permission/data", cmd)
      .query({ id: data.Id })
      .reply(200, response);

    await user.click(await screen.findByRole("button"));
    await user.type(screen.getByRole("textbox"), "123");
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(
      await screen.findByText(`${response.Msg} 資料異動筆數:${response.Data}`)
    ).toBeInTheDocument();
    expect(scope.isDone()).toBeTruthy();
    expect(invalidateQueries).toHaveBeenCalledTimes(1);
  });

  test("submit data error", async () => {
    const response: BaseResponse = {
      Code: "400",
      Msg: "資料不存在",
    };

    nock(url)
      .patch("/permission/data", cmd)
      .query({ id: data.Id })
      .reply(400, response);

    const { user } = renderUpdateDataDialog();
    await user.click(await screen.findByRole("button"));

    await user.type(screen.getByRole("textbox"), "123");
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(await screen.findByText(response.Msg)).toBeInTheDocument();
  });
});
