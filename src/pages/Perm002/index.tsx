import { useCallback, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { Item } from "@components/Elements";
import { useSessionStorageState } from "@hooks/useSessionStorageState";
import { useTableSelected } from "@hooks/useTableSelected";
import { permissionApi, PermissionType } from "./api";
import {
  AddDataDialog,
  LinkRolesDialog,
  Perm002Filter,
  UpdateDataDialog,
} from "./components";
import { columns } from "./utils";

const Perm002 = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });

  const [input, setInput] =
    useSessionStorageState<PermissionType.FetchPageInfoPayload>("input", {
      auth: " ",
      status: " ",
    });
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput({
        ...input,
        [e.target.name]: e.target.value,
      });
      setPaginationModel({ ...paginationModel, page: 0 });
    },
    [input, paginationModel, setInput]
  );

  const { data: fetchDataInfo } = permissionApi.useFetchPageInfo({
    ...input,
    size: paginationModel.pageSize,
  });
  const pageInfo = fetchDataInfo?.Data;
  //#endregion

  //#region table data
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>();

  const { selected, handleSelectedClick } =
    useTableSelected<PermissionType.PageDataSchema>();

  const fetchDataPayload = useMemo(() => {
    return {
      ...input,
      size: paginationModel.pageSize,
      page: paginationModel.page + 1,
    };
  }, [input, paginationModel.page, paginationModel.pageSize]);

  const { data: fetchData } = permissionApi.useFetchData(fetchDataPayload);
  const rows = fetchData?.Data.Rows;
  //#endregion

  return (
    <Grid container direction="column" p={2} spacing={1}>
      <Grid item xs="auto">
        <Item>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={3}
          >
            <Perm002Filter input={input} onInputChange={handleInputChange} />
            <AddDataDialog fetchDataPayload={fetchDataPayload} />
            <LinkRolesDialog Id={selected?.Id} />
            <UpdateDataDialog
              data={selected}
              fetchDataPayload={fetchDataPayload}
            />
          </Stack>
        </Item>
      </Grid>

      <Grid item xs container>
        <Item sx={{ p: 0 }}>
          <DataGrid
            rows={rows || []}
            columns={columns}
            getRowId={(row) => row.Id}
            columnHeaderHeight={37}
            sx={{
              height: "calc(100dvh - 148px)",
              flexDirection: "column-reverse",
            }}
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(ids) => {
              setRowSelectionModel(ids);
              handleSelectedClick(
                rows?.find((row) => row.Id === ids[0]) || null
              );
            }}
            pageSizeOptions={[25, 50, 100]}
            paginationModel={paginationModel}
            rowCount={pageInfo?.RowCount || 0}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
          />
        </Item>
      </Grid>
    </Grid>
  );
};

export default Perm002;
