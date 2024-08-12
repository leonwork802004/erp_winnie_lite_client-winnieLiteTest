import nock from "nock";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import { SetRoleDataResponse, UpdateRoleDataPayload } from "../api";
import { UpdateRoleDataDialog } from "../components";
import { buttons } from "../utils";

const id = 35;
const title = "test";
const status = 1;

describe("<UpdateRoleDataDialog />", () => {
  beforeEach(() => {
    mockButtonRequest([buttons.modifyRole]);
  });

  test("don't show dialog", async () => {
    const { user } = render(
      <UpdateRoleDataDialog
        id={undefined}
        title={undefined}
        status={undefined}
      />
    );

    await user.click(await screen.findByRole("button"));
    expect(screen.getByText("請選擇要修改的角色")).toBeInTheDocument();
  });

  test("update data success, status change", async () => {
    const payload: UpdateRoleDataPayload = {
      id: id,
      Title: "test123",
      Status: 0,
    };
    const mockResponse: SetRoleDataResponse = {
      Code: "200",
      Msg: "更新成功",
      Data: 3,
    };
    nock(url)
      .patch("/role/data", { Title: payload.Title, Status: payload.Status })
      .query({ id: payload.id })
      .reply(200, mockResponse);

    const { user } = render(
      <UpdateRoleDataDialog id={id} title={title} status={status} />
    );

    await user.click(await screen.findByRole("button"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("角色說明")).toHaveValue(title);
    expect(screen.getByText("啟用")).toBeInTheDocument();

    await user.type(screen.getByLabelText("角色說明"), "123");
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "停用" }));
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(await screen.findByText(mockResponse.Msg)).toBeInTheDocument();
  });

  test("update data success, status doesn't change", async () => {
    const payload: UpdateRoleDataPayload = {
      id: id,
      Title: "test123",
    };
    const mockResponse: SetRoleDataResponse = {
      Code: "200",
      Msg: "更新成功",
      Data: 3,
    };
    nock(url)
      .patch("/role/data", { Title: payload.Title, Status: undefined })
      .query({ id: payload.id })
      .reply(200, mockResponse);

    const { user } = render(
      <UpdateRoleDataDialog id={id} title={title} status={status} />
    );

    await user.click(await screen.findByRole("button"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("角色說明")).toHaveValue(title);
    expect(screen.getByText("啟用")).toBeInTheDocument();

    await user.type(screen.getByLabelText("角色說明"), "123");
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(await screen.findByText(mockResponse.Msg)).toBeInTheDocument();
  });
});
