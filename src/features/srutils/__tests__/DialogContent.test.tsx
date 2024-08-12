import nock from "nock";
import { TableColumn } from "@components/Elements";
import { render, screen, url } from "@tests/test-utils";
import {
  DisplayItemSchema,
  DisplayListSchema,
  DisplayMemberItemSchema,
  SRUtilsSearchType,
} from "../api";
import { DialogContent } from "../components";
import { columnMapping } from "../utils";

// mock render DialogContent<DisplayItem>
const title = "test";
const content = "DialogContent";
const open = true;
const close = vi.fn();
const handleItemConfirm = vi.fn();
const query = "123";

const columns: TableColumn<DisplayItemSchema>[] = [
  { title: "編號", field: "Key" },
  { title: "名稱", field: "Display" },
];

const columnsMember: TableColumn<DisplayMemberItemSchema>[] = [
  { title: columnMapping[0], field: "name" },
  { title: columnMapping[1], field: "Key" },
  { title: columnMapping[2], field: "loginEmail" },
  { title: columnMapping[3], field: "loginMobile" },
  { title: columnMapping[4], field: "mobile" },
  { title: columnMapping[5], field: "tel" },
  { title: columnMapping[6], field: "addr" },
];

const mockData: DisplayListSchema = [
  {
    Key: "123",
    Display: "維尼",
  },
  {
    Key: "456",
    Display: "小維尼",
  },
];

const mockDataMember: DisplayListSchema = [
  {
    Key: "123@test.com",
    Display:
      "維尼,123@test.com,456@test.com,0912345678,0987654321,0222222222,台灣",
  },
];

const mockApiResponse = (path: SRUtilsSearchType, data: DisplayListSchema) => {
  nock(url).get(`/srutils/${path}`).query({ q: query }).reply(200, data);
};

const renderDialogContent = <
  T extends DisplayItemSchema | DisplayMemberItemSchema
>(
  columns: TableColumn<T>[],
  path: SRUtilsSearchType
) =>
  render(
    <DialogContent<T>
      title={title}
      content={content}
      open={open}
      columns={columns}
      close={close}
      onItemConfirm={handleItemConfirm}
      path={path}
    />
  );

describe("<DialogContent<DisplayItem> />", () => {
  test("render success", () => {
    renderDialogContent(columns, SRUtilsSearchType.Item);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
    expect(screen.getByText(columns[0].title)).toBeInTheDocument();
    expect(screen.getByText(columns[1].title)).toBeInTheDocument();
  });

  test("error - input null", async () => {
    const { user } = renderDialogContent(columns, SRUtilsSearchType.Item);
    await user.click(screen.getByRole("button", { name: "查詢" }));
    expect(screen.getByText("請輸入查詢條件")).toBeInTheDocument();
  });

  test("fetch data success and get selected data", async () => {
    mockApiResponse(SRUtilsSearchType.Item, mockData);

    const { user } = renderDialogContent(columns, SRUtilsSearchType.Item);
    // 輸入查詢條件
    await user.type(screen.getByRole("textbox"), query);
    await user.click(screen.getByRole("button", { name: "查詢" }));

    const row = await screen.findByText("維尼");
    expect(row).toBeInTheDocument();

    // 選取 data row
    // 關閉彈窗
    await user.click(row);
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(handleItemConfirm).toHaveBeenCalledTimes(1);
    expect(handleItemConfirm).toHaveBeenCalledWith(mockData[0]);
    expect(close).toHaveBeenCalledTimes(1);
  });
});

describe("<DialogContent<DisplayItemMember> />", () => {
  test("render success", () => {
    renderDialogContent(columnsMember, SRUtilsSearchType.Member);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
    columnsMember.forEach((column) => {
      expect(screen.getByText(column.title)).toBeInTheDocument();
    });
  });

  test("fetch data success and get selected data", async () => {
    mockApiResponse(SRUtilsSearchType.Member, mockDataMember);

    const [name, , loginEmail, loginMobile, mobile, tel, addr] =
      mockDataMember[0].Display.split(",");

    const { user } = renderDialogContent(
      columnsMember,
      SRUtilsSearchType.Member
    );

    // 輸入查詢條件
    await user.type(screen.getByRole("textbox"), query);
    await user.click(screen.getByRole("button", { name: "查詢" }));

    const row = await screen.findByText(mockDataMember[0].Key);
    expect(row).toBeInTheDocument();

    expect(
      screen.queryByText(mockDataMember[0].Display)
    ).not.toBeInTheDocument();
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(loginEmail)).toBeInTheDocument();
    expect(screen.getByText(loginMobile)).toBeInTheDocument();
    expect(screen.getByText(mobile)).toBeInTheDocument();
    expect(screen.getByText(tel)).toBeInTheDocument();
    expect(screen.getByText(addr)).toBeInTheDocument();

    // 選取 data row
    // 關閉彈窗
    await user.click(row);
    await user.click(screen.getByRole("button", { name: "確定" }));
    expect(close).toHaveBeenCalledTimes(1);
    expect(handleItemConfirm).toHaveBeenCalledWith({
      ...mockDataMember[0],
      name,
      loginEmail,
      loginMobile,
      mobile,
      tel,
      addr,
    });
  });
});
