import { memo } from "react";
import { useDisclosure } from "@hooks/useDisclosure";
import { DisplayItemSchema, SRUtilsSearchType } from "../api";
import { DialogContent } from "./DialogContent";
import { SearchContent } from "./SearchContent";

type VendorSearchProps = {
  item: DisplayItemSchema;
  onItemChange: (item: DisplayItemSchema) => void;
};

export const VendorSearch = memo(
  ({ item, onItemChange }: VendorSearchProps) => {
    const { isOpen, open, close } = useDisclosure();

    return (
      <SearchContent
        title="廠商ID"
        buttonText="廠商查詢"
        item={item}
        onItemChange={onItemChange}
        open={open}
      >
        <DialogContent<DisplayItemSchema>
          title="廠商查詢"
          content="請輸入廠商簡稱:"
          open={isOpen}
          columns={[
            { title: "廠商編號", field: "Key", width: 200 },
            { title: "廠商簡稱", field: "Display", width: 200 },
          ]}
          close={close}
          onItemConfirm={onItemChange}
          path={SRUtilsSearchType.Vendor}
        />
      </SearchContent>
    );
  }
);
