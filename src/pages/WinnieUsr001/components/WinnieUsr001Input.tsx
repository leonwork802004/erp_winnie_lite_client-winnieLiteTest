import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { FetchWinnieUserPayload } from "../api";

type WinnieUsr001InputProps = {
  input: FetchWinnieUserPayload;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

const fields: { name: keyof FetchWinnieUserPayload; label: string }[] = [
  { name: "acct", label: "帳號" },
  { name: "name", label: "姓名" },
  { name: "empNo", label: "員工編號" },
  // { name: "usrNo", label: "使用者流水號" },
];

export const WinnieUsr001Input = ({
  input,
  onInputChange,
}: WinnieUsr001InputProps) => (
  <Stack spacing={{ xs: 1, md: 2 }} direction={{ xs: "row", md: "column" }}>
    {fields.map(({ name, label }) => (
      <TextField
        key={name}
        name={name}
        value={input[name]}
        onChange={onInputChange}
        label={label}
        size="small"
      />
    ))}
  </Stack>
);
