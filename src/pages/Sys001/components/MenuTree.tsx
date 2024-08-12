import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { CustomTreeItem } from "@components/Elements";
import { useGetMenuTrees } from "../api/api";
import { Menu, MenuTreeSchema } from "../api/type";
import { TreeItemContext } from "../utils";

type MenuTreesProps = {
  menuId?: number[];
  selectedItem: string | null;
  onSelectedItemChange: (id: string) => void;
  onSelectedMenuChange: (menu: MenuTreeSchema) => void;
  setParentId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const getItemId = (item: MenuTreeSchema) => item.Id.toString();
const getItemLabel = (item: MenuTreeSchema) => item.Title;

export const MenuTree = memo(
  ({
    menuId,
    selectedItem,
    onSelectedItemChange,
    onSelectedMenuChange,
    setParentId,
  }: MenuTreesProps) => {
    const apiRef = useTreeViewApiRef();
    const { data: menus } = useGetMenuTrees();
    const context = useMemo(() => ({ menuId }), [menuId]);

    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const findParentId = useCallback(
      (nodes: Menu[], targetId: string): number | undefined => {
        for (const node of nodes) {
          if (node.children) {
            for (const child of node.children) {
              if (child.Id.toString() === targetId) {
                return node.Id;
              }
            }
            const foundId = findParentId(node.children, targetId);
            if (foundId !== undefined) {
              return foundId;
            }
          }
        }
        return undefined;
      },
      []
    );

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
        onSelectedMenuChange(apiRef.current!.getItem(id));
        const foundId = findParentId(menus?.Data || [], id);
        setParentId(foundId);
      },
      [
        apiRef,
        findParentId,
        menus?.Data,
        onSelectedItemChange,
        onSelectedMenuChange,
        setParentId,
      ]
    );

    useEffect(() => {
      //預設展開至第二層即可
      if (menus?.Data) {
        // const IdList = menus.Data.flatMap(node => {
        //     const childIds = node.children ? node.children.map(child => child.Id.toString()) : [];
        //     return [node.Id.toString(), ...childIds];
        // });
        // setExpandedItems(IdList);
        const IdList = menus.Data.map((node) => node.Id.toString());
        setExpandedItems(IdList);
      }
    }, [menus?.Data]);

    if (!menus?.Data) return <></>;

    return (
      <TreeItemContext.Provider value={context}>
        <RichTreeView
          items={menus.Data}
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
