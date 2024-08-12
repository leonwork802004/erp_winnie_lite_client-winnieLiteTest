import { useCallback, useState } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Item } from "@components/Elements";
import { RoleTreeSchema, RoleTrees } from "@features/roleTrees";
import {
  AddRoleDataDialog,
  LinkPermissionsTable,
  MoveTreesDialog,
  UpdateRoleDataDialog,
} from "./components";

const Perm001 = () => {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<RoleTreeSchema | null>(null);

  const handleSelectedItemChange = useCallback((id: string) => {
    setSelectedItem(id);
  }, []);
  const handleSelectedRoleChange = useCallback((role: RoleTreeSchema) => {
    setSelectedRole(role);
  }, []);

  return (
    <Grid container direction={"row"} p={2} spacing={1}>
      <Grid item xs={2} container>
        <Item>
          <Box overflow={"auto"} height={"calc(100dvh - 96px)"}>
            <RoleTrees
              selectedItem={selectedItem}
              onSelectedItemChange={handleSelectedItemChange}
              onSelectedRoleChange={handleSelectedRoleChange}
            />
          </Box>
        </Item>
      </Grid>

      <Grid item xs={10} container direction={"column"}>
        <Grid item xs="auto">
          <Item>
            <Stack direction={"row"} spacing={2}>
              <AddRoleDataDialog />

              <MoveTreesDialog
                id={selectedRole?.Id}
                title={selectedRole?.Title}
              />

              <UpdateRoleDataDialog
                id={selectedRole?.Id}
                title={selectedRole?.Title}
                status={selectedRole?.Status}
              />
            </Stack>
          </Item>
        </Grid>

        <Grid item xs container pt={1}>
          <Item>
            <LinkPermissionsTable payload={selectedRole} />
          </Item>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Perm001;
