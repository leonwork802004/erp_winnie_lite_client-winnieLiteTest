import { isEqual } from "lodash-es";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TableRow from "@mui/material/TableRow";
import { useDisclosure } from "@hooks/useDisclosure";
import { TableColumn } from "..";
import { TableCell } from "../utils";

type TableContext<Entry> = {
  selected?: Entry;
  onSelectedClick?: (entry: Entry) => void;
  columns: TableColumn<Entry>[];
  getWidth: () => number;
};

export const ExpandableRow = <Entry,>({
  item: row,
  context: { selected, onSelectedClick = () => {}, columns, getWidth },
  ...props
}: {
  item: Entry;
  context: TableContext<Entry>;
}) => {
  const { isOpen, toggle } = useDisclosure();

  if (!row) return <></>;

  return (
    <>
      <TableRow
        {...(!isOpen && props)}
        hover
        onClick={() => onSelectedClick(row)}
        selected={isEqual(selected, row)}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {columns.map(({ Cell, field, title, isSortLabel = true }) => (
          <TableCell
            key={String(field) + title}
            align="left"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "0px",
            }}
            onClick={(e) => !isSortLabel && e.stopPropagation()}
          >
            {Cell ? <Cell entry={row} /> : (row[field] as React.ReactNode)}
          </TableCell>
        ))}
      </TableRow>
      {isOpen && (
        <TableRow {...props}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            {columns.map(({ Cell, title, field }) => (
              <Grid
                container
                key={String(field) + title}
                sx={{ margin: 1, width: `calc(${getWidth()}px - 48px)` }}
              >
                <Grid item xs={3}>
                  {title}
                </Grid>
                <Grid item xs={9}>
                  {Cell ? (
                    <Cell entry={row} />
                  ) : (
                    (row[field] as React.ReactNode)
                  )}
                </Grid>
              </Grid>
            ))}
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
