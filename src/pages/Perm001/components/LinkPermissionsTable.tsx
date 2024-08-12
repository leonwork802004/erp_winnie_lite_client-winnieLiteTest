import { memo } from "react";
import { Chip, Grid } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { RoleTreeSchema } from "@features/roleTrees";
import { PermissionDataSchema, useFetchLinkPermissions } from "../api";
import {
  ChipConfig,
  FilterMap,
  InheritedMap,
  TypesMap,
  statusMap,
} from "../utils";

type Props = {
  payload: RoleTreeSchema | null;
};

export const LinkPermissionsTable = memo(({ payload }: Props) => {
  const { data } = useFetchLinkPermissions(payload?.Id as number);

  return (
    <Grid container direction={"column"}>
      <Grid item xs="auto">
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <Typography variant="h5" mb={1}>
            角色對應權限
          </Typography>
          <Typography>{payload?.Title}</Typography>
        </Stack>
      </Grid>

      <Grid item xs container>
        <DataGrid
          rows={data?.Data || []}
          columns={columns}
          getRowId={(row) => row.Id}
          sx={{ height: "calc(100dvh - 194px)" }}
        />
      </Grid>
    </Grid>
  );
});

const getChip = ({ backgroundColor, content }: ChipConfig) => (
  <Chip sx={{ bgcolor: backgroundColor }} label={content} />
);

const columns: GridColDef<PermissionDataSchema>[] = [
  { headerName: "權限名稱、說明", field: "Title", width: 260 },
  {
    headerName: "授權類型",
    field: "Type",
    valueGetter: (_, { Type }) => TypesMap[Type] || Type,
  },
  {
    headerName: "權限狀態",
    field: "Status",
    valueGetter: (_, { Status }) => statusMap[Status] || Status,
  },
  {
    headerName: "過濾類型",
    field: "Filter",
    renderCell: ({ row: { Filter } }) =>
      FilterMap[Filter] ? getChip(FilterMap[Filter]) : Filter,
  },
  {
    headerName: "是否繼承",
    field: "Inherited",
    renderCell: ({ row: { Inherited } }) =>
      InheritedMap[Inherited] ? getChip(InheritedMap[Inherited]) : Inherited,
  },
  { headerName: "關聯資料 識別名稱", field: "LinkName", width: 150 },
  { headerName: "關聯資料 說明", field: "LinkTitle", width: 150 },
  {
    headerName: "關聯資料 狀態",
    field: "LinkStatus",
    valueGetter: (_, { LinkStatus }) =>
      (LinkStatus && statusMap[LinkStatus]) || LinkStatus,
  },
];
