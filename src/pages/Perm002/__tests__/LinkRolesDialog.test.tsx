import { faker } from "@faker-js/faker";
import nock from "nock";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import { RoleDataSchema } from "../api/permissionType";
import { LinkRolesDialog } from "../components";
import { buttons } from "../utils";

describe("<LinkRolesDialog />", () => {
  const mockData: RoleDataSchema = {
    Id: faker.number.int(),
    Name: faker.person.jobType(),
    Title: faker.person.jobTitle(),
    Filter: 1,
    Status: 1,
    Inherited: 0,
  };
  const mockRes = {
    Code: "200",
    Msg: "查詢成功",
    Data: [mockData],
  };

  test("get data success", async () => {
    mockButtonRequest([buttons.qry]);
    nock(url)
      .get("/permission/link/roles")
      .query({ id: 8 })
      .reply(200, mockRes);

    const { user } = render(<LinkRolesDialog Id={8} />);

    await user.click(await screen.findByRole("button"));
    expect(await screen.findByText("權限關聯角色")).toBeInTheDocument();
    expect(await screen.findByText(mockData.Id)).toBeInTheDocument();
    expect(screen.getByText(mockData.Name)).toBeInTheDocument();
    expect(screen.getByText(mockData.Title)).toBeInTheDocument();
    expect(screen.getByText("啟用")).toBeInTheDocument();
  });
});
