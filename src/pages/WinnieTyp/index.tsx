import { useRef, useState } from "react";
import { Box, Grid, TextField } from "@mui/material";
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { Item } from "@components/Elements";
import { Districts, districts } from "./utils";

const getItemId = (item: Districts) =>
  item.zip ? item.zip + item.name : item.name;
const getItemLabel = (item: Districts) =>
  item.zip ? item.zip + item.name : item.name;

const getItemDescendantsIds = (item: Districts) => {
  const ids: string[] = [];
  item.children?.forEach((child: Districts) => {
    ids.push(child.zip + child.name);
    ids.push(...getItemDescendantsIds(child));
  });

  return ids;
};
const getItemZips = (item: Districts) => {
  const zips: string[] = [];
  item.zip && zips.push(item.zip);
  item.children?.forEach((child: Districts) => {
    child.zip && zips.push(child.zip);
    zips.push(...getItemDescendantsIds(child));
  });

  return zips;
};

const WinnieTyp = () => {
  const [input, setInput] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const toggledItemRef = useRef<{ [itemId: string]: boolean }>({});
  const apiRef = useTreeViewApiRef();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleItemSelectionToggle = (
    _event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean
  ) => {
    toggledItemRef.current[itemId] = isSelected;
  };

  const handleSelectedItemsChange = (
    _event: React.SyntheticEvent,
    newSelectedItems: string[]
  ) => {
    const itemsToSelect: string[] = [];
    const itemsToUnSelect: { [itemId: string]: boolean } = {};
    const zipsToSelect: string[] = [];
    const zipsToUnSelect: { [itemId: string]: boolean } = {};

    Object.entries(toggledItemRef.current).forEach(([itemId, isSelected]) => {
      const item: Districts = apiRef.current!.getItem(itemId);
      if (isSelected) {
        itemsToSelect.push(...getItemDescendantsIds(item));
        zipsToSelect.push(...getItemZips(item));
      } else {
        getItemDescendantsIds(item).forEach((descendantId) => {
          itemsToUnSelect[descendantId] = true;
        });
        getItemZips(item).forEach((descendantId) => {
          zipsToUnSelect[descendantId] = true;
        });
      }
    });

    const newSelectedItemsWithChildren = Array.from(
      new Set(
        [...newSelectedItems, ...itemsToSelect].filter(
          (itemId) => !itemsToUnSelect[itemId]
        )
      )
    );
    const newSelectedZips = Array.from(
      new Set(
        [...(input && input.split(",")), ...zipsToSelect].filter(
          (itemId) => !zipsToUnSelect[itemId]
        )
      )
    );

    setSelectedItems(newSelectedItemsWithChildren);
    setInput(newSelectedZips.join(","));

    toggledItemRef.current = {};
  };

  return (
    <Grid container direction={"column"} p={2} spacing={2}>
      <Grid item xs="auto">
        <Item>
          <TextField
            label="請輸入郵遞區號"
            variant="outlined"
            size="small"
            fullWidth
            value={input}
            onChange={handleInputChange}
          />
        </Item>
      </Grid>

      <Grid item xs container>
        <Item>
          <Box overflow={"auto"} height={"calc(100dvh - 168px)"}>
            <RichTreeView
              multiSelect
              checkboxSelection
              apiRef={apiRef}
              items={districts}
              getItemId={getItemId}
              getItemLabel={getItemLabel}
              selectedItems={selectedItems}
              onSelectedItemsChange={handleSelectedItemsChange}
              onItemSelectionToggle={handleItemSelectionToggle}
            />
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
};

export default WinnieTyp;
