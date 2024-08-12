import nock from "nock";
import { render, screen, url } from "@tests/test-utils";
import { SRUtilsSearchType } from "../api";
import { MemberSearch } from "../components";

const item = { Key: "", Display: "" };
const handleItemChange = vi.fn();

const testData = [
  // all data
  {
    Key: "123@test.com",
    Display:
      "維尼,123@test.com,456@test.com,0912345678,0987654321,0222222222,台灣",
  },
  // no loginEmail
  {
    Key: "123@test.com",
    Display: "維尼,123@test.com, ,0912345678,0987654321,0222222222,台灣",
  },
  // no loginEmail and loginMobile
  {
    Key: "123@test.com",
    Display: "維尼,123@test.com,,,0987654321,0222222222,台灣",
  },
];

describe("<MemberSearch / >", () => {
  const fetchDataAndSelectRow = async (data: {
    Key: string;
    Display: string;
  }) => {
    const query = data.Display;
    const [name, , loginEmail, loginMobile] = data.Display.split(",");

    nock(url)
      .get(`/srutils/${SRUtilsSearchType.Member}`)
      .query({ q: query })
      .reply(200, [data]);

    const { user } = render(
      <MemberSearch item={item} onItemChange={handleItemChange} />
    );
    await user.click(screen.getByRole("button", { name: "姓名查詢" }));

    // 輸入查詢條件
    await user.type(screen.getByRole("textbox"), query);
    await user.click(screen.getByRole("button", { name: "查詢" }));

    const row = await screen.findByText(data.Key);
    expect(row).toBeInTheDocument();

    // 選取 data row
    // 關閉彈窗
    await user.click(row);
    await user.click(screen.getByRole("button", { name: "確定" }));

    return { name, loginEmail, loginMobile };
  };

  test("all data", async () => {
    const { name, loginEmail } = await fetchDataAndSelectRow(testData[0]);

    expect(handleItemChange).toHaveBeenCalledWith({
      Key: loginEmail,
      Display: name,
    });
  });

  test("loginEmail is null", async () => {
    const { name, loginMobile } = await fetchDataAndSelectRow(testData[1]);

    expect(handleItemChange).toHaveBeenCalledWith({
      Key: loginMobile,
      Display: name,
    });
  });

  test("loginEmail and loginMobile are null", async () => {
    const { name } = await fetchDataAndSelectRow(testData[2]);

    expect(handleItemChange).toHaveBeenCalledWith({
      Key: testData[2].Key,
      Display: name,
    });
  });
});
