import { useCallback } from "react";
import { useSessionStorageState } from "@hooks/useSessionStorageState";
import { DisplayItemSchema } from "../api";

export const useSrutilsSearch = () => {
  const defaultValue: DisplayItemSchema = {
    Key: "",
    Display: "",
  };
  const [item, setItem] = useSessionStorageState<DisplayItemSchema>(
    "item",
    defaultValue
  );
  const [vendor, setVendor] = useSessionStorageState<DisplayItemSchema>(
    "vendor",
    defaultValue
  );
  const [member, setMember] = useSessionStorageState<DisplayItemSchema>(
    "member",
    defaultValue
  );
  const handleItemChange = useCallback(
    (data: DisplayItemSchema) => setItem(data),
    [setItem]
  );
  const handleVendorChange = useCallback(
    (data: DisplayItemSchema) => setVendor(data),
    [setVendor]
  );
  const handleMemberChange = useCallback(
    (data: DisplayItemSchema) => setMember(data),
    [setMember]
  );

  return {
    item,
    handleItemChange,
    vendor,
    handleVendorChange,
    member,
    handleMemberChange,
  };
};
