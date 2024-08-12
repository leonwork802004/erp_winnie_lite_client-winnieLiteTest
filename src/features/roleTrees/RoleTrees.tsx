import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { CustomTreeItem } from "@components/Elements";
import { RoleTreeSchema, useFetchRoleTrees } from "./api";
import { TreeItemContext, getDataFromRoleTree } from "./utils";

type RoleTreesProps = {
  linkRoleId?: number[];
  selectedItem: string;
  onSelectedItemChange: (id: string) => void;
  onSelectedRoleChange: (role: RoleTreeSchema) => void;
};

const getItemId = (item: RoleTreeSchema) => item.Id.toString();
const getItemLabel = (item: RoleTreeSchema) => item.Title;

export const RoleTrees = memo(
  ({
    linkRoleId,
    selectedItem,
    onSelectedItemChange,
    onSelectedRoleChange,
  }: RoleTreesProps) => {
    const apiRef = useTreeViewApiRef();
    const { data: roles } = useFetchRoleTrees();

    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const context = useMemo(() => ({ linkRoleId }), [linkRoleId]);

    const handleExpandedItemsChange = useCallback(
      (_event: React.SyntheticEvent, itemIds: string[]) => {
        setExpandedItems(itemIds);
      },
      []
    );
    const handleSelectedItemChange = useCallback(
      (_event: React.SyntheticEvent, id: string | null) => {
        if (!id) return;
        onSelectedItemChange(id);
        onSelectedRoleChange(apiRef.current!.getItem(id));
      },
      [apiRef, onSelectedItemChange, onSelectedRoleChange]
    );

    useEffect(() => {
      if (roles) {
        setExpandedItems(getDataFromRoleTree(roles.Data));
      }
    }, [roles]);

    if (!roles) return <></>;

    return (
      <TreeItemContext.Provider value={context}>
        <RichTreeView
          items={roles.Data}
          getItemId={getItemId}
          getItemLabel={getItemLabel}
          expandedItems={expandedItems}
          selectedItems={selectedItem}
          onExpandedItemsChange={handleExpandedItemsChange}
          onSelectedItemsChange={handleSelectedItemChange}
          apiRef={apiRef}
          slots={{ item: CustomTreeItem }}
        />
      </TreeItemContext.Provider>
    );
  }
);
