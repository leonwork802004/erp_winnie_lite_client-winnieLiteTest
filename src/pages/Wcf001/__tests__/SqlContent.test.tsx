import nock from "nock";
import { render, screen, url, mockButtonRequest } from "@tests/test-utils";
import { SqlSearchResponse, SqlSearchData, SqlSearchType } from "../api";
import { SqlContent } from "../components";
import { createSql } from "../utils";

const sqlArray: SqlSearchData[] = Array.from({ length: 5 }, (_, index) =>
  createSql(`SQL 語法${index + 1}`)
);
const sqlId = "SQL 語法1";
const updateSqlArray = vi.fn();
const handleSqlSyntaxChange = vi.fn();

const mockSqlSelect = (sqlArray: SqlSearchData[], sqlSyntax: string) =>
  render(
    <SqlContent
      currentSql={sqlArray.find((sql) => sql.id === sqlId) || sqlArray[0]}
      sqlSyntax={sqlSyntax}
      updateSqlArray={updateSqlArray}
      onSqlSyntaxChange={handleSqlSyntaxChange}
    />
  );

describe("<SqlContent />", () => {
  beforeEach(() => {
    mockButtonRequest(["Wcf001_Execute", "Wcf001_ExplainPlan"]);
  });

  test("render success", () => {
    mockSqlSelect(sqlArray, "");
    expect(screen.getByLabelText("DB")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("UndoRoundedIcon")).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Visual Data" })
    ).toBeInTheDocument();
  });

  // db select 改變
  test("should change DB option", async () => {
    const { user } = mockSqlSelect(sqlArray, "");
    await user.click(screen.getByRole("combobox", { name: /DB/i }));
    await user.click(screen.getByRole("option", { name: /BL2/i }));

    expect(updateSqlArray).toHaveBeenCalledTimes(1);
    expect(updateSqlArray).toHaveBeenCalledWith({
      property: "db",
      data: "BL2",
    });
  });

  // action select 改變
  test("should change Action option", async () => {
    const { user } = mockSqlSelect(sqlArray, "");
    await user.click(screen.getByRole("combobox", { name: /Action/i }));
    await user.click(screen.getByRole("option", { name: /執行/i }));

    expect(updateSqlArray).toHaveBeenCalledTimes(1);
    expect(updateSqlArray).toHaveBeenCalledWith({
      property: "action",
      data: "執行",
    });
  });

  // input 為空 / input 改變
  test("should change input", async () => {
    const { user } = mockSqlSelect(sqlArray, "");

    const queryButton = await screen.findByRole("button", { name: /執行/i });
    await user.click(queryButton);
    expect(screen.getByText("請輸入查詢條件")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox"), "test");
    expect(handleSqlSyntaxChange).toHaveBeenCalledTimes(4);
  });

  // 切換語法前後按鈕
  test("sql change when redo or undo button click", async () => {
    const sqlSyntax = "test1";
    const newSqlArray = sqlArray.map((sql) =>
      sql.id === sqlId
        ? { ...sql, syntaxArray: ["test1", "test2", "test3"], syntaxIndex: 0 }
        : sql
    );

    const { user } = mockSqlSelect(newSqlArray, sqlSyntax);

    const undo = screen.getByTestId("UndoRoundedIcon").parentElement;
    const redo = screen.getByTestId("RedoRoundedIcon").parentElement;

    expect(undo).toBeDisabled();
    expect(redo).not.toBeDisabled();

    await user.click(redo as HTMLElement);
    expect(handleSqlSyntaxChange).toHaveBeenCalledWith("test2");
    expect(updateSqlArray).toHaveBeenCalledWith({
      property: "syntaxIndex",
      data: 1,
    });
  });

  const rerenderSqlContent = (sqlArray: SqlSearchData[], sqlSyntax: string) => {
    return (
      <SqlContent
        currentSql={
          sqlArray
            .map((sql) =>
              sql.id === sqlId
                ? { ...sql, syntaxIndex: 0, syntaxArray: [sqlSyntax] }
                : sql
            )
            .find((sql) => sql.id === sqlId) || sqlArray[0]
        }
        sqlSyntax={sqlSyntax}
        updateSqlArray={updateSqlArray}
        onSqlSyntaxChange={handleSqlSyntaxChange}
      />
    );
  };

  // executeQuery success and executePlan success and tab change
  test("should handle executeQuery and executePlan success, and tab change", async () => {
    const db = "ECDB";
    const sqlSyntax = "test";
    const mockData: SqlSearchResponse = {
      Code: "200",
      Msg: "執行結果",
    };

    nock(url)
      .post(`/wcf/${SqlSearchType.executeQuery}`, {
        DbName: db,
        Sql: sqlSyntax,
      })
      .reply(200, { ...mockData, Data: { Table: [[{ id: "123" }]] } })
      .post(`/wcf/${SqlSearchType.executePlan}`, {
        DbName: db,
        Sql: sqlSyntax,
      })
      .reply(200, {
        ...mockData,
        Data: { Table: [[{ PLAN_TABLE_OUTPUT: "PLAN_TABLE_OUTPUT" }]] },
      });

    const { rerender, user } = mockSqlSelect(sqlArray, sqlSyntax);

    // 點擊執行按鈕
    await user.click(await screen.findByRole("button", { name: "執行" }));
    expect(updateSqlArray).toHaveBeenCalledTimes(1);
    expect(updateSqlArray).toHaveBeenCalledWith(
      {
        property: "syntaxIndex",
        data: 0,
      },
      {
        property: "syntaxArray",
        data: [sqlSyntax],
      }
    );

    // 重新渲染
    rerender(rerenderSqlContent(sqlArray, sqlSyntax));

    expect(
      await screen.findByRole("columnheader", { name: "id" })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "123" })).toBeInTheDocument();
    expect(screen.getByText(mockData.Msg)).toBeInTheDocument();

    // 點擊 plan 按鈕
    await user.click(screen.getByRole("button", { name: "Plan" }));

    expect(await screen.findByText(/PLAN_TABLE_OUTPUT/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "id" })
    ).not.toBeInTheDocument();
    expect(updateSqlArray).toHaveBeenCalledTimes(1);
  });

  // executeNonQuery success
  test("should handle executeNonQuery success", async () => {
    const db = "ECDB";
    const sqlSyntax = "test";
    const newSqlArray = sqlArray.map((sql) =>
      sql.id === sqlId ? { ...sql, action: "執行" } : sql
    );
    const mockData: SqlSearchResponse = {
      Code: "200",
      Msg: "執行結果",
    };

    nock(url)
      .post(`/wcf/${SqlSearchType.executeNonQuery}`, {
        DbName: db,
        Sql: sqlSyntax,
      })
      .reply(200, mockData);

    const { rerender, user } = mockSqlSelect(newSqlArray, sqlSyntax);

    // 點擊執行按鈕
    await user.click(await screen.findByRole("button", { name: "執行" }));

    expect(updateSqlArray).toHaveBeenCalledWith(
      {
        property: "syntaxIndex",
        data: 0,
      },
      {
        property: "syntaxArray",
        data: [sqlSyntax],
      }
    );

    rerender(rerenderSqlContent(newSqlArray, sqlSyntax));
    expect(await screen.findByText(mockData.Msg)).toBeInTheDocument();
  });
});
