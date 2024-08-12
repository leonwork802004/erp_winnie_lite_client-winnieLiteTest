import { UserEvent } from "@testing-library/user-event";
import nock from "nock";
import { BaseResponse } from "@appTypes/baseResponse";
import { queryClient } from "@lib/tanstack";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import { PermissionType } from "../api";
import { AddDataDialog } from "../components";
import { buttons } from "../utils";

const cmd: PermissionType.AddDataPayload = {
  Auth: 1,
  LinkId: "123",
  Title: "測試",
  Status: 1,
};

const handleTypeData = async (user: UserEvent) => {
  await user.type(
    screen.getByRole("textbox", { name: "關聯流水序號" }),
    cmd.LinkId
  );
  await user.type(
    screen.getByRole("textbox", { name: "權限名稱、說明" }),
    cmd.Title
  );
};

describe("<AddDataDialog />", () => {
  beforeEach(() => {
    mockButtonRequest([buttons.addPerm]);
  });

  test("open dialog success", async () => {
    const { user } = render(<AddDataDialog fetchDataPayload={{}} />);
    await user.click(await screen.findByRole("button", { name: "新增權限" }));
    expect(
      screen.getByRole("dialog", { name: "新增權限" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "授權類型" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "關聯流水序號" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "權限名稱、說明" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "權限狀態" })
    ).toBeInTheDocument();
  });

  test("reset data when dialog close", async () => {
    const { user } = render(<AddDataDialog fetchDataPayload={{}} />);
    await user.click(await screen.findByRole("button", { name: "新增權限" }));

    await user.type(
      screen.getByRole("textbox", { name: "關聯流水序號" }),
      "123456"
    );
    await user.click(screen.getByRole("button", { name: "取消" }));

    await user.click(await screen.findByRole("button", { name: "新增權限" }));
    expect(screen.getByRole("textbox", { name: "關聯流水序號" })).toHaveValue(
      ""
    );
  });

  test("LinkId null", async () => {
    const { user } = render(<AddDataDialog fetchDataPayload={{}} />);
    await user.click(await screen.findByRole("button", { name: "新增權限" }));

    await user.click(screen.getByRole("button", { name: "確定" }));
    expect(screen.getByText("關聯流水序號必填")).toBeInTheDocument();
  });

  test("LinkId type error", async () => {
    const { user } = render(<AddDataDialog fetchDataPayload={{}} />);
    await user.click(await screen.findByRole("button", { name: "新增權限" }));

    await user.type(
      screen.getByRole("textbox", { name: "關聯流水序號" }),
      "abc"
    );

    await user.click(screen.getByRole("button", { name: "確定" }));
    expect(screen.getByText("關聯流水序號必須為數字")).toBeInTheDocument();
  });

  test("submit data success", async () => {
    const { user } = render(<AddDataDialog fetchDataPayload={{}} />);
    await user.click(await screen.findByRole("button", { name: "新增權限" }));

    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

    const response: PermissionType.SetDataResponse = {
      Code: "200",
      Msg: "新增成功",
      Data: { Id: 10 },
    };
    nock(url).post("/permission/data", cmd).reply(200, response);

    await handleTypeData(user);
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(await screen.findByText(/新增成功/i)).toBeInTheDocument();
    expect(screen.getByText(/流水序號:10/i)).toBeInTheDocument();
    expect(invalidateQueries).toHaveBeenCalledTimes(1);
  });

  test("submit data error", async () => {
    const { user } = render(<AddDataDialog fetchDataPayload={{}} />);
    await user.click(await screen.findByRole("button", { name: "新增權限" }));

    const response: BaseResponse = {
      Code: "400",
      Msg: "資料已存在",
    };
    nock(url).post("/permission/data", cmd).reply(400, response);

    await handleTypeData(user);
    await user.click(screen.getByRole("button", { name: "確定" }));
    expect(await screen.findByText(response.Msg)).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
