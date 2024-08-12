import toast from "react-hot-toast";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { UserButton } from "@features/userButton";
import { useSessionStorageState } from "@hooks/useSessionStorageState";
import { useSqlExecute, SqlSearchData, SqlSearchType } from "../api";
import { SqlInput } from "./SqlInput";
import { SqlSelectFormControl } from "./SqlSelectFormControl";
import { SqlTabs } from "./SqlTabs";

type SqlSelectProps = {
  sqlSyntax: string;
  currentSql: SqlSearchData;
  onSqlSyntaxChange: (syntax: string) => void;
  updateSqlArray: (
    ...updates: {
      property: string;
      data: any;
    }[]
  ) => void;
};

export const SqlContent = ({
  sqlSyntax,
  currentSql,
  onSqlSyntaxChange,
  updateSqlArray,
}: SqlSelectProps) => {
  // DB / Action 選項
  const sqlDb = ["ECDB", "BL2"];
  const sqlAction = ["查詢", "執行"];
  // DB / Action 選項改變
  const handleSelectChange = (e: any, label: string) => {
    updateSqlArray({
      property: label,
      data: e.target.value,
    });
  };
  // tab 頁籤
  const [tabValue, setTabValue] = useSessionStorageState<number>("tabValue", 0);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // fetch api
  const fetchSqlQuery = useSqlExecute(currentSql.id, {
    db: currentSql.db,
    action:
      currentSql.action === "查詢"
        ? SqlSearchType.executeQuery
        : SqlSearchType.executeNonQuery,
    inputText: sqlSyntax,
  });
  const fetchSqlPlan = useSqlExecute(currentSql.id, {
    db: currentSql.db,
    action: SqlSearchType.executePlan,
    inputText: sqlSyntax,
  });

  // 按鈕
  const renderLoadingButton = (
    actionType: SqlSearchType,
    label: string,
    featureName: string
  ) => (
    <UserButton
      featureName={featureName}
      isLoading={
        actionType === SqlSearchType.executePlan
          ? fetchSqlPlan.isFetching
          : fetchSqlQuery.isFetching
      }
      variant="outlined"
      startIcon={<PlayArrowIcon />}
      onClick={() => handleExecuteOrPlan(actionType)}
    >
      {label}
    </UserButton>
  );

  // 執行 or Plan
  const handleExecuteOrPlan = (actionType: SqlSearchType) => {
    if (!sqlSyntax.trim()) {
      toast.error("請輸入查詢條件");
      return;
    }

    // 執行 api
    if (actionType === SqlSearchType.executePlan) {
      fetchSqlPlan.refetch();
      setTabValue(1);
    } else {
      fetchSqlQuery.refetch();
      setTabValue(0);
    }

    // 執行的語法 = 目前的語法 -> 語法保持不變
    if (sqlSyntax === currentSql.syntaxArray[currentSql.syntaxIndex]) {
      return;
    }

    // 執行的語法 != 目前的語法 -> 更新儲存物件
    const newIndex = currentSql.syntaxIndex + 1;
    const newArray1 = currentSql.syntaxArray.slice(0, newIndex);
    const newArray2 = currentSql.syntaxArray.slice(newIndex);
    updateSqlArray(
      { property: "syntaxIndex", data: newIndex },
      {
        property: "syntaxArray",
        data: [...newArray1, sqlSyntax, ...newArray2],
      }
    );
  };

  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Grid container direction="column" spacing={1} height="100%">
        {/* 選項 */}
        <Grid item xs="auto">
          <Stack direction="row" spacing={2}>
            <SqlSelectFormControl
              id="DB"
              label="DB"
              options={sqlDb}
              value={currentSql.db}
              onChange={(e) => handleSelectChange(e, "db")}
            />
            <SqlSelectFormControl
              id="Action"
              label="Action"
              options={sqlAction}
              value={currentSql.action}
              onChange={(e) => handleSelectChange(e, "action")}
            />
            {renderLoadingButton(
              SqlSearchType.executeQuery,
              "執行",
              "Wcf001_Execute"
            )}
            {renderLoadingButton(
              SqlSearchType.executePlan,
              "Plan",
              "Wcf001_ExplainPlan"
            )}
          </Stack>
        </Grid>

        {/* input 欄位 */}
        <SqlInput
          sqlSyntax={sqlSyntax}
          currentSql={currentSql}
          onSqlSyntaxChange={onSqlSyntaxChange}
          updateSqlArray={updateSqlArray}
        />

        {/* tabs */}
        <SqlTabs
          tabValue={tabValue}
          sqlSyntax={sqlSyntax}
          currentSql={currentSql}
          onTabChange={handleTabChange}
        />
      </Grid>
    </Paper>
  );
};
