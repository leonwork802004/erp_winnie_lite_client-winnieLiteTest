import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { MenuSchema, RootMenuSchema, useFetchUserRoot } from "@api/userRoot";
import { useSessionStorageState } from "@hooks/useSessionStorageState";
import { useAuthStore } from "@store/auth";

type MenuListProps = {
  isOpen: boolean;
  close: () => void;
};

export const Menu = memo(({ isOpen, close }: MenuListProps) => {
  const { setAuth } = useAuthStore((state) => state);
  const { data: menus } = useFetchUserRoot();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("RefreshTokenExpires");
    localStorage.removeItem("AccessTokenExpires");
    sessionStorage.clear();
    setAuth(false);
    close();
  }, [close, setAuth]);

  return (
    <Drawer
      anchor={"left"}
      open={isOpen}
      onClose={close}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <Toolbar variant="dense">
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={"登出"} />
          </ListItemButton>

          <IconButton onClick={close}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>

        <Divider />

        {menus && <RenderRichTreeView menus={menus} close={close} />}
      </Box>
    </Drawer>
  );
});

type RenderRichTreeViewProps = {
  menus: RootMenuSchema;
  close: () => void;
};

const getItemId = (item: MenuSchema) => item.Title + item.Id;
const getItemLabel = (item: MenuSchema) => item.Title;

const RenderRichTreeView = memo(({ menus, close }: RenderRichTreeViewProps) => {
  const apiRef = useTreeViewApiRef();
  const navigate = useNavigate();

  const [expandedItems, setExpandedItems] = useSessionStorageState<string[]>(
    "expandedItems",
    [],
    false
  );
  const [selectedItem, setSelectedItem] = useSessionStorageState<string>(
    "selectedItem",
    "",
    false
  );

  const handleClick = useCallback(
    (path: string) => {
      navigate(path);
      close();
    },
    [close, navigate]
  );

  const handleExpandedItemsChange = useCallback(
    (_event: React.SyntheticEvent, itemIds: string[]) =>
      setExpandedItems(itemIds),
    [setExpandedItems]
  );
  const handleSelectedItemChange = useCallback(
    (_event: React.SyntheticEvent, id: string | null) => {
      if (!id) return;

      const item: MenuSchema = apiRef.current!.getItem(id);
      if (item?.FeatureName) {
        id && setSelectedItem(id);
        handleClick(item.FeatureName);
      }
    },
    [apiRef, handleClick, setSelectedItem]
  );

  return (
    <RichTreeView
      items={menus.Children}
      apiRef={apiRef}
      getItemId={getItemId}
      getItemLabel={getItemLabel}
      selectedItems={selectedItem}
      onSelectedItemsChange={handleSelectedItemChange}
      expandedItems={expandedItems}
      onExpandedItemsChange={handleExpandedItemsChange}
    />
  );
});
