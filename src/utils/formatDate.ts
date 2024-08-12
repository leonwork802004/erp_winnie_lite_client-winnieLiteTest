import dayjs from "dayjs";

export const formatDate = (v: string | undefined) => {
  return v ? dayjs(v).format("YYYY/MM/DD HH:mm:ss") : "";
};
