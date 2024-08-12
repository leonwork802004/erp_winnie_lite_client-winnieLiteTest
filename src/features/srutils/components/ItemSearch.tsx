import { memo } from "react";
import { useDisclosure } from "@hooks/useDisclosure";
import { DisplayItemSchema, SRUtilsSearchType } from "../api";
import { DialogContent } from "./DialogContent";
import { SearchContent } from "./SearchContent";

type ItemSearchProps = {
  item: DisplayItemSchema;
  onItemChange: (item: DisplayItemSchema) => void;
};

export const ItemSearch = memo(({ item, onItemChange }: ItemSearchProps) => {
  const { isOpen, open, close } = useDisclosure();

  return (
    <SearchContent
      title="商品ID"
      buttonText="商品查詢"
      item={item}
      onItemChange={onItemChange}
      open={open}
    >
      <DialogContent<DisplayItemSchema>
        title="商品查詢"
        content="請輸入商品名稱:"
        open={isOpen}
        columns={[
          { title: "商品編號", field: "Key", width: 200 },
          { title: "商品名稱", field: "Display", width: 200 },
        ]}
        close={close}
        onItemConfirm={onItemChange}
        path={SRUtilsSearchType.Item}
      />
    </SearchContent>
  );
});
