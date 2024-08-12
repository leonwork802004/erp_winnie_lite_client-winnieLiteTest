import nock from "nock";
import { BaseResponse } from "@appTypes/baseResponse";
import { queryClient } from "@lib/tanstack";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import { AddRoleDataPayload, AddRoleDataResponse } from "../api";
import { AddRoleDataDialog } from "../components";
import { buttons } from "../utils";

const payload: AddRoleDataPayload = {
  Name: "test_usr_20",
  Title: "",
  Status: 1,
};

describe("<AddRoleDataDialog />", () => {
  beforeEach(() => {
    mockButtonRequest([buttons.addRole]);
  });

  test("show error message if name is null", async () => {
    const { user } = render(<AddRoleDataDialog />);
    await user.click(await screen.findByRole("button"));
    await user.click(screen.getByRole("button", { name: "確定" }));
    expect(screen.getByText("請輸入角色識別名稱")).toBeInTheDocument();
  });

  test("reset form value if dialog close", async () => {
    const { user } = render(<AddRoleDataDialog />);
    await user.click(await screen.findByRole("button"));

    await user.type(screen.getByLabelText("角色說明"), "test");
    expect(screen.getByLabelText("角色說明")).toHaveValue("test");

    await user.click(screen.getByRole("button", { name: "取消" }));

    await user.click(await screen.findByRole("button"));
    expect(screen.getByLabelText("角色說明")).toHaveValue("");
  });

  test("add data success", async () => {
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
    const response: AddRoleDataResponse = {
      Code: "200",
      Msg: "新增成功",
      Data: {
        ParentId: 20,
        Id: 30,
      },
    };
    nock(url).post("/role/data", payload).reply(200, response);

    const { user } = render(<AddRoleDataDialog />);
    await user.click(await screen.findByRole("button"));

    await user.type(screen.getByLabelText(/角色識別名稱/i), payload.Name);
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(
      await screen.findByText(
        `${response.Msg} 上層流水序號:${response.Data.ParentId} 角色流水序號:${response.Data.Id}`
      )
    ).toBeInTheDocument();
    expect(invalidateQueries).toHaveBeenCalledTimes(1);
  });

  test("add data failure", async () => {
    const response: BaseResponse = {
      Code: "400",
      Msg: "角色已存在",
    };
    nock(url).post("/role/data", payload).reply(400, response);

    const { user } = render(<AddRoleDataDialog />);
    await user.click(await screen.findByRole("button"));

    await user.type(screen.getByLabelText(/角色識別名稱/i), payload.Name);
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(await screen.findByText(response.Msg)).toBeInTheDocument();
  });
});
