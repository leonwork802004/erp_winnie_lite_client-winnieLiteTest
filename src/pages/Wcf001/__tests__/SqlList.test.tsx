import { render, screen } from "@tests/test-utils";
import { SqlSearchData } from "../api";
import { SqlList } from "../components";
import { createSql } from "../utils";

const sqlArray: SqlSearchData[] = Array.from({ length: 5 }, (_, index) =>
  createSql(`SQL 語法${index + 1}`)
);
const sqlId = "SQL 語法1";
const handleSqlArrayChange = vi.fn();
const handleSqlIdChange = vi.fn();
const handleSqlSyntaxChange = vi.fn();

const mockSqlList = () =>
  render(
    <SqlList
      sqlArray={sqlArray}
      sqlId={sqlId}
      onSqlArrayChange={handleSqlArrayChange}
      onSqlIdChange={handleSqlIdChange}
      onSqlSyntaxChange={handleSqlSyntaxChange}
    />
  );

describe("<SqlList />", () => {
  test("render success", () => {
    mockSqlList();
    expect(screen.getByRole("button", { name: "SQL 區塊" }));
    expect(screen.getByRole("button", { name: "SQL 語法1" }));
    expect(screen.getByRole("button", { name: "SQL 語法5" }));
  });

  // List 開關
  test("List open and close success", async () => {
    const { user } = mockSqlList();
    const sql1Button = screen.getByRole("button", { name: "SQL 語法1" });
    expect(sql1Button).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "SQL 區塊" }));
    expect(sql1Button).not.toBeInTheDocument();
  });

  // 區塊切換
  test("change sqlId selected", async () => {
    const { user } = mockSqlList();
    await user.click(screen.getByRole("button", { name: "SQL 語法2" }));

    expect(handleSqlIdChange).toHaveBeenCalledWith("SQL 語法2");
    expect(handleSqlSyntaxChange).toHaveBeenCalledWith("");
  });

  // 新增區塊
  test("add sql array", async () => {
    const { user } = mockSqlList();
    await user.click(screen.getByTestId("AddIcon"));

    expect(handleSqlArrayChange).toHaveBeenCalledWith([
      ...sqlArray,
      createSql(`SQL 語法${sqlArray.length + 1}`),
    ]);
  });

  // 刪除區塊 -> 刪除的區塊 = 選中的區塊
  test("delete sql array, sqlId = selected", async () => {
    const { user } = mockSqlList();
    const delButton = screen.getAllByTestId("DeleteIcon");
    await user.click(delButton[0]);

    const newArray = sqlArray.filter((v) => v.id !== "SQL 語法1");
    expect(handleSqlArrayChange).toHaveBeenCalledWith(newArray);
    expect(handleSqlIdChange).toHaveBeenCalledWith("SQL 語法2");
    expect(handleSqlSyntaxChange).toHaveBeenCalledWith("");
  });

  // 刪除區塊 -> 刪除的區塊 != 選中的區塊
  test("delete sql array, sqlId != selected", async () => {
    const sqlId = "SQL 語法5";
    const { user } = render(
      <SqlList
        sqlArray={sqlArray}
        sqlId={sqlId}
        onSqlArrayChange={handleSqlArrayChange}
        onSqlIdChange={handleSqlIdChange}
        onSqlSyntaxChange={handleSqlSyntaxChange}
      />
    );

    const delButton = screen.getAllByTestId("DeleteIcon");
    await user.click(delButton[0]);

    const newArray = sqlArray.filter((v) => v.id !== "SQL 語法1");
    expect(handleSqlArrayChange).toHaveBeenCalledWith(newArray);
    expect(handleSqlIdChange).toHaveBeenCalledTimes(0);
    expect(handleSqlSyntaxChange).toHaveBeenCalledTimes(0);
  });

  // 刪除區塊 -> 刪除的區塊 = 最後一個區塊
  test("delete sql array, sqlId = the last one", async () => {
    const sqlArray: SqlSearchData[] = [createSql("SQL 語法1")];
    const { user } = render(
      <SqlList
        sqlArray={sqlArray}
        sqlId={sqlId}
        onSqlArrayChange={handleSqlArrayChange}
        onSqlIdChange={handleSqlIdChange}
        onSqlSyntaxChange={handleSqlSyntaxChange}
      />
    );

    const delButton = screen.getByTestId("DeleteIcon");
    await user.click(delButton);

    expect(handleSqlArrayChange).toHaveBeenCalledTimes(0);
    expect(handleSqlIdChange).toHaveBeenCalledTimes(0);
    expect(handleSqlSyntaxChange).toHaveBeenCalledTimes(0);
  });
});
