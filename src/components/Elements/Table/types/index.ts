/**
 * column 表格欄
 * @param title th 文字
 * @param field column 對應 data key
 * @param width column 寬度
 * @param isSortLabel 是否支援排序
 * @param Cell column td 帶入的 ReactElement
 */
export type TableColumn<Entry> = {
  title: string;
  field: keyof Entry;
  width?: number;
  isSortLabel?: boolean;
  Cell?({ entry }: { entry: Entry }): React.ReactElement;
};

// table type
export type Order = "asc" | "desc";
