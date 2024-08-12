import nock from "nock";
import { queryClient } from "@lib/tanstack";
import {
  mockButtonRequest,
  render,
  screen,
  url,
  waitFor,
} from "@tests/test-utils";
import { PermissionType } from "../api";
import { DeleteLinkRolesDialog } from "../components";
import { buttons } from "../utils";

const Id = 8;
const handleSelectedClick = vi.fn();

describe("<DeleteLinkRolesDialog />", () => {
  beforeEach(() => {
    mockButtonRequest([buttons.delRoles]);
  });

  test("show error message if selected is null", async () => {
    const selected = null;

    const { user } = render(
      <DeleteLinkRolesDialog
        Id={Id}
        selected={selected}
        onSelectedClick={handleSelectedClick}
      />
    );

    expect(
      await screen.findByRole("button", { name: "移除角色權限" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "移除角色權限" }));
    expect(screen.getByText("請選擇要移除的權限")).toBeInTheDocument();
  });

  test("show error message if inherited = 1", async () => {
    const selected: PermissionType.RoleDataSchema = {
      Status: 1,
      Filter: 1,
      Id: 1,
      Name: "",
      Title: "",
      Inherited: 1,
    };

    const { user } = render(
      <DeleteLinkRolesDialog
        Id={Id}
        selected={selected}
        onSelectedClick={handleSelectedClick}
      />
    );

    await user.click(
      await screen.findByRole("button", { name: "移除角色權限" })
    );
    expect(screen.getByText("繼承權限無法移除")).toBeInTheDocument();
  });

  test("delete success", async () => {
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

    const selected: PermissionType.RoleDataSchema = {
      Status: 1,
      Filter: 1,
      Id: 1,
      Name: "",
      Title: "",
      Inherited: 0,
    };
    const payload: PermissionType.SetLinkRolesPayload = {
      id: Id,
      roleId: selected.Id,
    };
    const response: PermissionType.SetDataResponse = {
      Code: "200",
      Msg: "移除成功",
      Data: { Id: 10 },
    };

    nock(url)
      .delete("/permission/link/roles")
      .query(payload)
      .reply(200, response);

    const { user } = render(
      <DeleteLinkRolesDialog
        Id={Id}
        selected={selected}
        onSelectedClick={handleSelectedClick}
      />
    );

    await user.click(
      await screen.findByRole("button", { name: "移除角色權限" })
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "確定" }));
    expect(await screen.findByText(response.Msg)).toBeInTheDocument();
    expect(invalidateQueries).toHaveBeenCalledTimes(1);
    expect(handleSelectedClick).toHaveBeenCalledTimes(1);
    expect(handleSelectedClick).toHaveBeenCalledWith(null);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
