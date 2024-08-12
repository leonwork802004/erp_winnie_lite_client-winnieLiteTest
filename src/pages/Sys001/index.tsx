import { useState } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { Item } from "@components/Elements";
import { useTableSelected } from "@hooks/useTableSelected";
import { MenuTreeSchema, PageBtnSchema } from "./api/type";
import { MenuTree, AddMenuDialog, EditMenuDialog, AddBtnDialog, EditBtnDialog, RemoveRELDialog, AddRELDialog, BtnTable } from "./components";

const Sys001 = () => {
    const { selected: selectedItem, handleSelectedClick: handleSelectedItemChange } =
        useTableSelected<string>();

    const { selected: selectedMenu, handleSelectedClick: handleSelectedMenuChange } =
        useTableSelected<MenuTreeSchema>()
    const [parentId, setParentId] = useState<number>();

    const { selected: selectedBtn, handleSelectedClick } =
        useTableSelected<PageBtnSchema>();
    const [rowSelectionModel, setRowSelectionModel] =
        useState<GridRowSelectionModel>();

    return (
        <Grid container direction={"row"} p={2} spacing={1}>
            <Grid item xs={2} container>
                <Item>
                    <Box overflow={"auto"} height={"calc(100dvh - 96px)"}>
                        <MenuTree
                            selectedItem={selectedItem}
                            onSelectedItemChange={handleSelectedItemChange}
                            onSelectedMenuChange={handleSelectedMenuChange}
                            setParentId={setParentId}
                        />
                    </Box>
                </Item>
            </Grid>

            <Grid item xs={10} container direction={"column"}>
                <Grid item xs="auto">
                    <Item>
                        <Stack direction={"row"} spacing={2}>
                            <AddMenuDialog selectedMenuItem={selectedMenu} />
                            <EditMenuDialog selectedMenuItem={selectedMenu} parentId={parentId} handleSelectedMenuChange={handleSelectedMenuChange} handleSelectedItemChange={handleSelectedItemChange} />
                            {selectedMenu?.PageId &&
                                <>
                                    <AddRELDialog selectedMenuItem={selectedMenu} />
                                    <RemoveRELDialog selectedMenuItem={selectedMenu} selectedBtnItem={selectedBtn} />
                                    <AddBtnDialog selectedMenuItem={selectedMenu} />
                                    <EditBtnDialog selectedMenuItem={selectedMenu} selectedBtnItem={selectedBtn} onSelectItemChange={handleSelectedClick} setRowSelectionModel={setRowSelectionModel} />
                                </>
                            }
                        </Stack>
                    </Item>
                </Grid>

                <Grid item xs container pt={1}>
                    <Item>
                        <BtnTable selectedMenuItem={selectedMenu} onSelectItemChange={handleSelectedClick} rowSelectionModel={rowSelectionModel} setRowSelectionModel={setRowSelectionModel} />
                    </Item>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Sys001;