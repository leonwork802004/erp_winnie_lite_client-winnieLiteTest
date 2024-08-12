import { useMemo } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { TabPanel, Table, TableColumn } from "@components/Elements";
import { useTableSelected } from "@hooks/useTableSelected";
import { SqlSearchData, SqlSearchType, useSqlExecute } from "../api";

type SqlTabsProps = {
  tabValue: number;
  sqlSyntax: string;
  currentSql: SqlSearchData;
  onTabChange: (_event: React.SyntheticEvent, newValue: number) => void;
};

export const SqlTabs = ({
  tabValue,
  sqlSyntax,
  currentSql: { id, db, action, syntaxIndex },
  onTabChange,
}: SqlTabsProps) => {
  // tab 頁籤
  const tabs = ["Visual Data", "Plan Table Output"];
  // 選取 row
  const { selected, handleSelectedClick } = useTableSelected<any>();

  // fetch api
  const fetchSqlQuery = useSqlExecute(id, {
    db: db,
    action:
      action === "查詢"
        ? SqlSearchType.executeQuery
        : SqlSearchType.executeNonQuery,
    inputText: sqlSyntax,
  });
  const fetchSqlPlan = useSqlExecute(id, {
    db: db,
    action: SqlSearchType.executePlan,
    inputText: sqlSyntax,
  });

  // table 資料
  const data = fetchSqlQuery?.data?.Data?.Table[0];
  const columns: TableColumn<any>[] = useMemo(() => {
    return data && data[0]
      ? Object.keys(data[0]).map((value) => ({ title: value, field: value }))
      : [];
  }, [data]);

  const plan = fetchSqlPlan?.data?.Data?.Table;

  const isSyntaxIndex = syntaxIndex > -1;

  return (
    <>
      {/* tab 頁籤 */}
      <Grid item xs="auto">
        <Tabs value={tabValue} onChange={onTabChange} sx={{ mb: 1 }}>
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} />
          ))}
        </Tabs>
      </Grid>

      {/* table */}
      <Grid item xs height="100%" overflow="hidden">
        <TabPanel value={tabValue} index={0}>
          <Stack height="100%" direction={"column"}>
            <Table
              data={isSyntaxIndex && data}
              columns={isSyntaxIndex ? columns : []}
              selected={selected}
              onSelectedClick={handleSelectedClick}
            />
            {isSyntaxIndex && fetchSqlQuery.data && fetchSqlQuery.data.Msg && (
              <Typography>{fetchSqlQuery.data.Msg}</Typography>
            )}
          </Stack>
        </TabPanel>
        <TabPanel
          value={tabValue}
          index={1}
          overflow="auto"
          sx={{
            "& pre": { m: 0 },
          }}
        >
          {plan &&
            plan.map((v) => {
              const keys = Object.keys(v);
              return keys.map((key) => (
                <pre key={`${v}${key}`}>
                  {JSON.stringify(v[key], undefined, 2)}
                </pre>
              ));
            })}
        </TabPanel>
      </Grid>
    </>
  );
};
