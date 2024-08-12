import { faker } from "@faker-js/faker";
import { RoleTreeResponse, RoleTreeSchema } from "@features/roleTrees";

const createRoleTreeData = (): RoleTreeSchema => ({
  Id: faker.number.int(),
  Title: faker.lorem.words(),
  Name: faker.lorem.word(),
  Status: faker.number.int(1),
  children: undefined,
});
export const mockRoleTreeData = faker.helpers.multiple(createRoleTreeData, {
  count: 3,
});
export const mockRoleTreeResponse: RoleTreeResponse = {
  Code: "200",
  Msg: "",
  Data: mockRoleTreeData,
};
