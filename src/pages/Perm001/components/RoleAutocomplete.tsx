import { useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { RoleTreeSchema, useFetchRoleTrees } from "@features/roleTrees";

export type RoleOption = { id: number; label: string };

type Props = {
  option: RoleOption | null;
  onOptionChange: (_event: any, newValue: RoleOption | null) => void;
  label?: string;
};

export const RoleAutocomplete = ({ option, onOptionChange, label }: Props) => {
  const { data: roles } = useFetchRoleTrees();

  const options: RoleOption[] = useMemo(
    () => getTitleFromRoleTree(roles?.Data),
    [roles]
  );

  return (
    <Autocomplete
      size="small"
      sx={{ mt: 3 }}
      options={options}
      value={option}
      onChange={onOptionChange}
      renderInput={(params) => (
        <TextField {...params} label={!label ? "移動至" : label} />
      )}
    />
  );
};

const getTitleFromRoleTree = (
  roles: RoleTreeSchema[] | undefined
): RoleOption[] => {
  const data: RoleOption[] = [];

  if (roles) {
    for (const role of roles) {
      data.push({ id: role.Id, label: role.Title });

      if (role.children) {
        data.push(...getTitleFromRoleTree(role.children));
      }
    }
  }

  return data;
};
