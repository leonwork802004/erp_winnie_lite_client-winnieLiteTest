import { memo } from "react";
import { useDisclosure } from "@hooks/useDisclosure";
import {
  DisplayItemSchema,
  DisplayMemberItemSchema,
  SRUtilsSearchType,
} from "../api";
import { columnMapping } from "../utils";
import { DialogContent } from "./DialogContent";
import { SearchContent } from "./SearchContent";

type MemberSearchProps = {
  item: DisplayItemSchema;
  onItemChange: (item: DisplayItemSchema) => void;
};

export const MemberSearch = memo(
  ({ item, onItemChange }: MemberSearchProps) => {
    const { isOpen, open, close } = useDisclosure();
    const handleItemConfirm = (item: DisplayMemberItemSchema) => {
      onItemChange({
        Key: item.loginEmail.trim() || item.loginMobile.trim() || item.Key,
        Display: item.name,
      });
    };

    return (
      <SearchContent
        title="客戶帳號(Email或手機)"
        buttonText="姓名查詢"
        item={item}
        onItemChange={onItemChange}
        open={open}
      >
        <DialogContent<DisplayMemberItemSchema>
          title="eMail查詢"
          content="輸入會員姓名:"
          open={isOpen}
          columns={[
            { title: columnMapping[0], field: "name" },
            { title: columnMapping[1], field: "Key", width: 170 },
            { title: columnMapping[2], field: "loginEmail" },
            { title: columnMapping[3], field: "loginMobile" },
            { title: columnMapping[4], field: "mobile" },
            { title: columnMapping[5], field: "tel" },
            { title: columnMapping[6], field: "addr" },
          ]}
          close={close}
          onItemConfirm={handleItemConfirm}
          path={SRUtilsSearchType.Member}
        />
      </SearchContent>
    );
  }
);
