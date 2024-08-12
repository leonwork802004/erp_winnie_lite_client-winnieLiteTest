import { memo } from "react";
import { TextField } from "@mui/material";
import { GetDataPayload } from "../api";

type Props = {
  input: GetDataPayload;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const QryInputField = memo(({ input, onInputChange }: Props) => {
  return (
    <>
      <TextField
        fullWidth
        label="訂單編號"
        size="small"
        name="ordId"
        value={input.ordId}
        onChange={onInputChange}
      />
      <TextField
        fullWidth
        label="撿貨單號"
        size="small"
        name="pickId"
        value={input.pickId}
        onChange={onInputChange}
      />
    </>
  );
});
