import MenuItem from "@mui/material/MenuItem";
import TextField, { TextFieldProps } from "@mui/material/TextField";

type SqlSelectFormControlProps = TextFieldProps & {
  options: string[];
};
export const SqlSelectFormControl = ({
  options,
  ...props
}: SqlSelectFormControlProps) => (
  <TextField size="small" select sx={{ minWidth: 120 }} {...props}>
    {options.map((v) => (
      <MenuItem key={v} value={v}>
        {v}
      </MenuItem>
    ))}
  </TextField>
);
