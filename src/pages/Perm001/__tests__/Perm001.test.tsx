import { faker } from "@faker-js/faker";
import nock from "nock";
import { render, screen, url } from "@tests/test-utils";
import Perm001 from "..";
import { FetchLinkPermissionsResponse, PermissionDataSchema } from "../api";
import { mockRoleTreeData, mockRoleTreeResponse } from "./mockRoleTreeData";

const createData = (): PermissionDataSchema => ({
  Id: faker.number.int(),
  Title: faker.lorem.word(),
  Type: faker.number.int({ min: 1, max: 2 }),
  Filter: faker.number.int(1),
  LinkId: faker.number.int(),
  LinkName: faker.lorem.word(),
  LinkTitle: faker.lorem.word(),
  LinkStatus: faker.number.int(1),
  Status: faker.number.int(1),
  Inherited: faker.number.int(1),
});
const mockData = faker.helpers.multiple(createData, {
  count: 2,
});
const mockResponse: FetchLinkPermissionsResponse = {
  Code: "200",
  Msg: "",
  Data: mockData,
};

describe("<Perm001 />", () => {
  test("search role link permissions success", async () => {
    nock(url)
      .get("/role/trees")
      .reply(200, mockRoleTreeResponse)
      .get("/role/link/permissions")
      .query({ id: mockRoleTreeData[0].Id })
      .reply(200, mockResponse);

    const { user } = render(<Perm001 />);

    expect(screen.getByText("角色對應權限")).toBeInTheDocument();

    await user.click(await screen.findByText(mockRoleTreeData[0].Title));

    expect(
      await screen.findByRole("gridcell", { name: mockData[0].Title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("gridcell", { name: mockData[0].LinkTitle })
    ).toBeInTheDocument();
  });
});
