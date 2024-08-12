import React, { useCallback, useRef } from "react";
import { TableComponents, TableVirtuoso } from "react-virtuoso";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { useSessionStorageState } from "@hooks/useSessionStorageState";
import { ExpandableRow, FixedHeaderContent } from "./components";
import { Order, TableColumn } from "./types";
import { getComparator } from "./utils";

// TODO: 目前 table 在 expandableRow 卸載時會導致畫面跳躍

/**
 * table props
 * @param data 顯示資料
 * @param columns 表格欄
 * @param selected 選取 row
 * @param onSelectedClick selected click
 */
type TableProps<Entry> = {
  data: Entry[] | undefined;
  columns: TableColumn<Entry>[];
  selected?: Entry | null;
  onSelectedClick?: (entry: Entry) => void;
};

const VirtuosoTableComponents = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props: any) => (
    <MuiTable {...props} size="small" sx={{ width: "auto" }} />
  ),
  TableHead,
  TableRow: ExpandableRow,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const TableComponent = <Entry extends { [key: string]: number | string }>({
  data,
  columns,
  selected,
  onSelectedClick,
}: TableProps<Entry>) => {
  const ref = useRef<HTMLDivElement>(null);

  //#region table 排序
  const [order, setOrder] = useSessionStorageState<Order>("order", "asc");
  const [orderBy, setOrderBy] = useSessionStorageState<keyof Entry>(
    "orderBy",
    ""
  );

  const createSortHandler = useCallback(
    (property: keyof Entry) => () => {
      const isAsc = orderBy === property && order === "asc";
      const isDesc = orderBy === property && order === "desc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(isDesc ? "" : property);
    },
    [order, orderBy, setOrder, setOrderBy]
  );

  const visibleRows = React.useMemo(
    () => data && data.slice().sort(getComparator(order, orderBy)),
    [order, orderBy, data]
  );
  //#endregion

  // rwd 取得展開 row 寬度
  const getWidth = useCallback(() => {
    const table = ref.current?.querySelector("table");
    const stackWidth = ref.current?.clientWidth;
    const tableWidth = table?.clientWidth;

    if (table && stackWidth !== undefined && tableWidth !== undefined) {
      return tableWidth > stackWidth ? stackWidth : tableWidth;
    }

    return 0;
  }, []);

  const fixedHeaderContent = useCallback(
    () => (
      <FixedHeaderContent
        columns={columns}
        order={order}
        orderBy={orderBy}
        onSortClick={createSortHandler}
      />
    ),
    [columns, createSortHandler, order, orderBy]
  );

  return (
    <Box height="100%" ref={ref}>
      <TableVirtuoso<Entry>
        data={visibleRows}
        components={VirtuosoTableComponents as TableComponents<Entry>}
        fixedHeaderContent={fixedHeaderContent}
        context={{
          selected,
          onSelectedClick,
          columns,
          getWidth,
        }}
      />
    </Box>
  );
};

export const Table = React.memo(TableComponent) as typeof TableComponent;
