import { memo } from "react";
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { EnforceOrderPayload, useGetModeMapping } from "../api";

type Props = {
  input: EnforceOrderPayload;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  failedInput: string;
  onFailedInputChange: (value: string) => void;
};

export const DivInputField = memo(
  ({ input, onInputChange, failedInput, onFailedInputChange }: Props) => {
    const { data } = useGetModeMapping();

    return (
      <Stack spacing={{ xs: 1, md: 2 }} pt={1}>
        <TextField
          fullWidth
          label="需派入訂單編號"
          size="small"
          multiline
          rows={7}
          name="dispatchId"
          value={input.dispatchId}
          onChange={onInputChange}
        />
        <TextField
          fullWidth
          label="重派失敗訂單編號如下"
          size="small"
          multiline
          rows={7}
          value={failedInput}
          onChange={(e) => onFailedInputChange(e.target.value)}
        />
        {data?.Data && (
          <TextField
            fullWidth
            label="強制派單模式"
            size="small"
            select
            name="mode"
            value={input.mode}
            onChange={onInputChange}
          >
            {data.Data.map((v) => (
              <MenuItem key={v.Key} value={v.Key}>
                {v.Display}
              </MenuItem>
            ))}
          </TextField>
        )}
        <FormControlLabel
          control={
            <Checkbox
              name="isDelete"
              checked={input.isDelete}
              onChange={onInputChange}
            />
          }
          label="呼叫刪單"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isPick"
              checked={input.isPick}
              onChange={onInputChange}
            />
          }
          label="呼叫撿貨單"
        />
      </Stack>
    );
  }
);
