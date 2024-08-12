import { render, screen } from "@tests/test-utils";
import SqlSearchPage from "..";

describe("<SqlSearch />", () => {
  test("render success", () => {
    render(<SqlSearchPage />);
    expect(screen.getByText(/SQL 區塊/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/DB/i)).toBeInTheDocument();
    expect(screen.getByTestId("UndoRoundedIcon")).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Visual Data/i })
    ).toBeInTheDocument();
  });

  // sql 區塊改變
  test("change sql select success", async () => {
    const { user } = render(<SqlSearchPage />);
    // 改變 db 選項
    await user.click(screen.getByRole("combobox", { name: /DB/i }));
    await user.click(screen.getByRole("option", { name: /BL2/i }));

    await user.click(screen.getByRole("button", { name: "SQL 語法2" }));
    expect(screen.queryByText(/BL2/i)).not.toBeInTheDocument();
    expect(screen.getByText(/ECDB/i)).toBeInTheDocument();
  });
});
