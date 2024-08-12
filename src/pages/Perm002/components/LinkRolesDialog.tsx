import { memo } from "react";
import toast from "react-hot-toast";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { green, red } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Circular, Table, TableColumn } from "@components/Elements";
import { UserButton } from "@features/userButton";
import { useDisclosure } from "@hooks/useDisclosure";
import { useTableSelected } from "@hooks/useTableSelected";
import { permissionApi, PermissionType } from "../api";
import { buttons } from "../utils";
import { DeleteLinkRolesDialog, SetLinkRolesDialog } from ".";

type LinkRolesDialogProps = {
  Id: number | undefined;
};

const columns: TableColumn<PermissionType.RoleDataSchema>[] = [
  { title: "角色 Id", field: "Id" },
  { title: "識別名稱", field: "Name", width: 140 },
  { title: "說明", field: "Title", width: 150 },
  {
    title: "狀態",
    field: "Status",
    Cell({ entry: { Status } }) {
      return <>{Status === 0 ? "停用" : Status === 1 ? "啟用" : ""}</>;
    },
  },
  {
    title: "過濾類型",
    field: "Filter",
    Cell({ entry: { Filter } }) {
      let backgroundColor = "";
      let content = "";

      switch (Filter) {
        case 1:
          backgroundColor = green[100];
          content = "授權";
          break;
        case 2:
          backgroundColor = red[100];
          content = "拒絕存取";
          break;
      }

      return (
        <>
          {backgroundColor && (
            <Typography
              bgcolor={backgroundColor}
              borderRadius={3}
              align="center"
              maxWidth={120}
              fontSize={"14px"}
            >
              {content}
            </Typography>
          )}
        </>
      );
    },
  },
];

export const LinkRolesDialog = memo(({ Id }: LinkRolesDialogProps) => {
  const { isOpen, close, open } = useDisclosure();

  const handleOpen = () => {
    if (!Id) {
      toast.error("請選擇權限");
      return;
    }
    open();
  };

  const { data, isFetching } = permissionApi.useFetchLinkRoles(
    Id as number,
    isOpen
  );
  const { selected, handleSelectedClick } =
    useTableSelected<PermissionType.RoleDataSchema>();

  return (
    <>
      <UserButton
        featureName={buttons.qry}
        onClick={handleOpen}
        startIcon={<ManageAccountsIcon />}
        variant="outlined"
      >
        關聯角色
      </UserButton>

      <Dialog onClose={close} open={isOpen} fullWidth maxWidth="md">
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <DialogTitle>權限關聯角色</DialogTitle>
          <Stack direction={"row"} spacing={2} paddingX={3}>
            <SetLinkRolesDialog Id={Id as number} Filter={1} />
            <SetLinkRolesDialog Id={Id as number} Filter={2} />
            <DeleteLinkRolesDialog
              Id={Id as number}
              selected={selected}
              onSelectedClick={handleSelectedClick}
            />
          </Stack>
        </Stack>

        <DialogContent sx={{ height: 500 }}>
          {isFetching ? (
            <Circular />
          ) : (
            <Table<PermissionType.RoleDataSchema>
              data={data?.Data}
              columns={columns}
              selected={selected}
              onSelectedClick={handleSelectedClick}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});
