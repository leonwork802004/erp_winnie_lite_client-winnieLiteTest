import { render, screen } from "@tests/test-utils";
import { ItemSearch } from "../components";

const item = { Key: "", Display: "" };
const handleItemChange = vi.fn();

describe("<ItemSearch / >", () => {
  test("render success", async () => {
    const { user } = render(
      <ItemSearch item={item} onItemChange={handleItemChange} />
    );
    expect(screen.getByText("商品ID")).toBeInTheDocument();

    const showButton = screen.getByRole("button", { name: "商品查詢" });
    expect(showButton).toBeInTheDocument();
    await user.click(showButton);

    expect(
      screen.getByRole("heading", { name: "商品查詢" })
    ).toBeInTheDocument();
    expect(screen.getByText("請輸入商品名稱:")).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /商品編號/i })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /商品名稱/i })).toBeInTheDocument();
  });
});
