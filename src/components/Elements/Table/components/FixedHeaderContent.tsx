import { memo } from "react";
import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Order, TableColumn } from "..";
import { TableCell } from "../utils";

type Props<Entry> = {
  columns: TableColumn<Entry>[];
  order: Order;
  orderBy: keyof Entry;
  onSortClick: (property: keyof Entry) => () => void;
};

const FixedHeaderContentComponent = <Entry,>({
  columns,
  order,
  orderBy,
  onSortClick,
}: Props<Entry>) => {
  if (!columns || columns.length === 0) return <></>;

  return (
    <TableRow>
      <TableCell>
        <Box width={34} />
      </TableCell>
      {columns.map(({ title, field, width = null, isSortLabel = true }) => {
        const isOrderByField = orderBy === field;
        return (
          <TableCell
            key={String(field) + title}
            align="left"
            sx={{
              p: 0,
              whiteSpace: "nowrap",
            }}
            sortDirection={isOrderByField ? order : false}
          >
            <Box
              sx={{
                width: width,
                resize: "horizontal",
                overflow: "hidden",
                padding: "6px 16px",
              }}
            >
              {isSortLabel ? (
                <TableSortLabel
                  active={isOrderByField}
                  direction={isOrderByField ? order : "asc"}
                  onClick={onSortClick(field)}
                  sx={{
                    "&.Mui-active": {
                      color: "white",
                    },
                  }}
                >
                  {title}
                </TableSortLabel>
              ) : (
                title
              )}
            </Box>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export const FixedHeaderContent = memo(
  FixedHeaderContentComponent
) as typeof FixedHeaderContentComponent;
