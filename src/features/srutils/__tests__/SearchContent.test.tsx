import { render, screen } from "@tests/test-utils";
import { SearchContent } from "../components";

const title = "Title";
const buttonText = "Search";
const item = { Key: "123", Display: "Test Item" };
const handleItemChange = vi.fn();
const open = vi.fn();

const renderSearchContent = () =>
  render(
    <SearchContent
      title={title}
      buttonText={buttonText}
      item={item}
      onItemChange={handleItemChange}
      open={open}
    >
      <div data-testid="child-component"></div>
    </SearchContent>
  );

describe("<SearchContent />", () => {
  test("render success", () => {
    renderSearchContent();

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: buttonText })
    ).toBeInTheDocument();
    const textbox = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(textbox[0].value).toBe(item.Key);
    expect(textbox[1].value).toBe(item.Display);
    expect(screen.getByTestId("child-component")).toBeInTheDocument();
  });

  test("input fields change", async () => {
    const { user } = renderSearchContent();
    const textbox = screen.getAllByRole("textbox") as HTMLInputElement[];
    await user.type(textbox[0], "4");
    expect(handleItemChange).toHaveBeenCalledWith({ ...item, Key: "1234" });
  });

  test("button click", async () => {
    const { user } = renderSearchContent();
    await user.click(screen.getByRole("button", { name: buttonText }));
    expect(open).toHaveBeenCalled();
    expect(open).toHaveBeenCalledTimes(1);
  });
});
