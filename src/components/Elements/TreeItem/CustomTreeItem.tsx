import { forwardRef, useContext } from "react";
import WysiwygOutlinedIcon from "@mui/icons-material/WysiwygOutlined";
import { Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { useTreeItem2Utils } from "@mui/x-tree-view/hooks";
import { TreeItem2, TreeItem2Props } from "@mui/x-tree-view/TreeItem2";
import {
  UseTreeItem2ContentSlotOwnProps,
  unstable_useTreeItem2 as useTreeItem2,
} from "@mui/x-tree-view/useTreeItem2";
import { TreeItemContext } from "../../../features/roleTrees/utils";

export const CustomTreeItem = forwardRef(
  (props: TreeItem2Props, ref: React.Ref<HTMLLIElement>) => {
    const { id, itemId, label, disabled, children } = props;
    const { interactions } = useTreeItem2Utils({
      itemId,
      children,
    });

    const { linkRoleId } = useContext(TreeItemContext);

    const { publicAPI } = useTreeItem2({
      id,
      itemId,
      children,
      label,
      disabled,
      rootRef: ref,
    });

    const item = publicAPI.getItem(itemId);

    const handleContentClick: UseTreeItem2ContentSlotOwnProps["onClick"] = (
      event
    ) => {
      event.defaultMuiPrevented = true;
      interactions.handleSelection(event);
    };

    const handleIconContainerClick = (event: React.MouseEvent) => {
      interactions.handleExpansion(event);
    };

    const labelItem = item.PageId ? (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>{item.Title}</Typography>
        <WysiwygOutlinedIcon color="primary" />
      </div>
    ) : (
      label
    );

    return (
      <TreeItem2
        ref={ref}
        {...props}
        slotProps={{
          content: {
            onClick: handleContentClick,
            style: {
              color: item.Status === 0 ? grey[400] : undefined,
              backgroundColor: linkRoleId?.includes(item.Id)
                ? blue[100]
                : undefined,
            },
          },
          iconContainer: { onClick: handleIconContainerClick },
        }}
        label={labelItem}
      />
    );
  }
);
