import { faker } from "@faker-js/faker";
import nock from "nock";
import { RoleTreeResponse, RoleTreeSchema } from "@features/roleTrees";
import { queryClient } from "@lib/tanstack";
import {
  convertHexToRGBA,
  mockButtonRequest,
  render,
  screen,
  url,
  waitFor,
} from "@tests/test-utils";
import { PermissionType } from "../api";
import { SetLinkRolesDialog } from "../components";
import { buttons } from "../utils";

const Id = 8;
const mockRolesData: PermissionType.RoleDataSchema = {
  Id: 1,
  Status: 1,
  Filter: 1,
  Name: "測試",
  Title: "測試權限",
  Inherited: 0,
};

describe("<SetLinkRolesDialog />", () => {
  beforeEach(() => {
    mockButtonRequest([buttons.setRoles]);
  });

  test("show error message if selected is null", async () => {
    const { user } = render(<SetLinkRolesDialog Id={Id} Filter={1} />);

    await user.click(
      await screen.findByRole("button", { name: "授權角色權限" })
    );

    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(screen.getByText("請選擇要授權的權限")).toBeInTheDocument();
  });

  test("set role permission", async () => {
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

    const selected: RoleTreeSchema = {
      Id: faker.number.int(),
      Name: faker.lorem.sentence(1),
      Title: faker.lorem.sentence(2),
      Status: faker.number.int(1),
    };

    // 查詢權限關聯角色
    const linkRolesResponse: PermissionType.RoleDataResponse = {
      Code: "200",
      Msg: "",
      Data: [mockRolesData],
    };
    // 查詢角色樹狀圖
    const roleTreeResponse: RoleTreeResponse = {
      Code: "200",
      Msg: "",
      Data: [selected, mockRolesData],
    };
    // 授權角色權限
    const payload: PermissionType.SetLinkRolesPayload = {
      id: Id,
      roleId: selected.Id,
      filter: 1,
    };
    const setDataResponse: PermissionType.SetDataResponse = {
      Code: "200",
      Msg: "無資料異動",
      Data: { Id: 8 },
    };

    nock(url)
      // 查詢權限關聯角色
      .get("/permission/link/roles")
      .query({ id: Id })
      .reply(200, linkRolesResponse)
      // 查詢角色樹狀圖
      .get("/role/trees")
      .reply(200, roleTreeResponse)
      // 授權角色權限
      .put("/permission/link/roles")
      .query(payload)
      .reply(200, setDataResponse);

    const { user } = render(<SetLinkRolesDialog Id={Id} Filter={1} />);

    await user.click(
      await screen.findByRole("button", { name: "授權角色權限" })
    );
    expect(await screen.findByText(selected.Title)).toBeInTheDocument();
    expect(screen.getByText(mockRolesData.Title)).toHaveStyle({
      backgroundColor: convertHexToRGBA("#e3f2fd"),
    });

    await user.click(screen.getByText(selected.Title));
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(await screen.findByText("確定授權角色權限?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(
      await screen.findByText(
        `對應角色權限流水序號:${setDataResponse.Data.Id} ${setDataResponse.Msg}`
      )
    );
    expect(invalidateQueries).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
