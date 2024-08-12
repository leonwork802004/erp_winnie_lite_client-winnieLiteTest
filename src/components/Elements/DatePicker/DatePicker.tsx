import dayjs, { Dayjs } from "dayjs";
import { useEffect, useRef } from "react";
import {
  DatePicker as MuiDatePicker,
  DatePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import "dayjs/locale/zh-tw";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.locale("zh-tw");

export const DatePicker = ({
  value,
  slotProps,
  ...props
}: DatePickerProps<Dayjs>) => {
  const isClearable = useRef<boolean>(false);

  useEffect(() => {
    if (isClearable.current) {
      const timeout = setTimeout(() => {
        isClearable.current = false;
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        slotProps={{
          field: {
            clearable: true,
            onClear: () => {
              isClearable.current = true;
            },
          },
          textField: { size: "small" },
          ...slotProps,
        }}
        value={dayjs(value).isValid() ? dayjs(value) : null}
        format="YYYY/MM/DD"
        {...props}
      />
    </LocalizationProvider>
  );
};
