import { memo } from "react";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { PermissionType } from "../api";

type Perm002FilterProps = {
  input: PermissionType.FetchPageInfoPayload;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export const Perm002Filter = memo(
  ({ input, onInputChange }: Perm002FilterProps) => (
    <Stack spacing={{ xs: 1, md: 2 }} direction="row">
      <TextField
        select
        label="狀態"
        defaultValue=" "
        size="small"
        value={input.status}
        onChange={onInputChange}
        name="status"
      >
        <MenuItem value=" ">全部</MenuItem>
        <MenuItem value={0}>停用</MenuItem>
        <MenuItem value={1}>啟用</MenuItem>
      </TextField>
      <TextField
        select
        label="權限類型"
        defaultValue=" "
        size="small"
        value={input.auth}
        onChange={onInputChange}
        name="auth"
      >
        <MenuItem value=" ">全部</MenuItem>
        <MenuItem value={1}>按鈕權限</MenuItem>
        <MenuItem value={2}>畫面權限</MenuItem>
        <MenuItem value={3}>API 權限</MenuItem>
      </TextField>
    </Stack>
  )
);
