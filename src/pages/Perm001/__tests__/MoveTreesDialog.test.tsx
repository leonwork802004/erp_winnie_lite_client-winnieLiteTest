import nock from "nock";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import { MoveTreesPayload, SetRoleDataResponse } from "../api";
import { MoveTreesDialog } from "../components";
import { buttons } from "../utils";
import { mockRoleTreeData, mockRoleTreeResponse } from "./mockRoleTreeData";

const id = 2;
const title = "test";

describe("<MoveTreesDialog />", () => {
  beforeEach(() => {
    mockButtonRequest([buttons.moveRole]);
  });

  test("don't show dialog if id is null", async () => {
    const { user } = render(
      <MoveTreesDialog id={undefined} title={undefined} />
    );

    await user.click(await screen.findByRole("button"));
    expect(screen.getByText("請選擇要移動的角色")).toBeInTheDocument();
  });

  test("show error message if option is null", async () => {
    const { user } = render(<MoveTreesDialog id={id} title={title} />);

    await user.click(await screen.findByRole("button"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "確定" }));
    expect(screen.getByText("請選擇想要移動到的節點")).toBeInTheDocument();
  });

  test("update data success", async () => {
    const payload: MoveTreesPayload = {
      id: id,
      toParent: mockRoleTreeData[0].Id,
    };
    const mockResponse: SetRoleDataResponse = {
      Code: "200",
      Msg: "移動成功",
      Data: 3,
    };
    nock(url)
      .get("/role/trees")
      .reply(200, mockRoleTreeResponse)
      .patch("/role/trees")
      .query(payload)
      .reply(200, mockResponse);

    const { user } = render(<MoveTreesDialog id={id} title={title} />);

    await user.click(await screen.findByRole("button"));
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText(mockRoleTreeData[0].Title));
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(screen.getByText("確定移動節點?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(await screen.findByText(mockResponse.Msg)).toBeInTheDocument();
  });
});
