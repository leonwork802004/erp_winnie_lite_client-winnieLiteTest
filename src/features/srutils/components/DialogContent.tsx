import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import DialogContentText from "@mui/material/DialogContentText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  Dialog,
  LoadingButton,
  Table,
  TableColumn,
} from "@components/Elements";
import { useTableSelected } from "@hooks/useTableSelected";
import { DisplayItemSchema, SRUtilsSearchType, useFetchItem } from "../api";

type DialogContentProps<T> = {
  title: string;
  content: string;
  open: boolean;
  columns: TableColumn<T>[];
  close: () => void;
  onItemConfirm: (item: T) => void;
  path: SRUtilsSearchType;
};

type Input = {
  name: string;
};

export const DialogContent = <T extends DisplayItemSchema>({
  title,
  content,
  open,
  columns,
  close,
  onItemConfirm,
  path,
}: DialogContentProps<T>) => {
  const [itemName, setItemName] = useState<string>("");
  const { selected, handleSelectedClick } = useTableSelected<T | null>();

  const { register, handleSubmit, setValue } = useForm<Input>();

  // 表單送出後 fetch data
  const onSubmit: SubmitHandler<Input> = (data) => {
    if (!data.name.trim()) {
      toast.error("請輸入查詢條件");
      return;
    }
    if (data.name === itemName) {
      refetch();
    }
    setItemName(data.name);
  };

  const { data, isFetching, refetch } = useFetchItem(itemName, path);

  // 關閉彈窗
  const handleClose = () => {
    setValue("name", "");
    setItemName("");
    close();
    handleSelectedClick(null);
  };

  const handleConfirm = () => {
    if (selected) {
      onItemConfirm(selected);
    }
    handleClose();
  };

  return (
    <Dialog
      isOpen={open}
      size={path !== SRUtilsSearchType.Member ? "sm" : "md"}
      title={title}
      onCancel={handleClose}
      onConfirm={handleConfirm}
    >
      <Stack sx={{ height: 450 }} spacing={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <DialogContentText>{content}</DialogContentText>
          <TextField {...register("name")} size="small" />
          <LoadingButton
            variant="outlined"
            type="submit"
            isLoading={isFetching}
          >
            查詢
          </LoadingButton>
        </Box>
        <Table<T>
          data={data as T[]}
          columns={columns}
          selected={selected}
          onSelectedClick={handleSelectedClick}
        />
      </Stack>
    </Dialog>
  );
};
