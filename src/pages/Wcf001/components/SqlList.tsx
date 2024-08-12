import React from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useDisclosure } from "@hooks/useDisclosure";
import { useSessionStorageState } from "@hooks/useSessionStorageState";
import { SqlSearchData } from "../api";
import { createSql } from "../utils";

type SqlListProps = {
  sqlArray: SqlSearchData[];
  sqlId: string;
  onSqlArrayChange: (array: SqlSearchData[]) => void;
  onSqlIdChange: (id: string) => void;
  onSqlSyntaxChange: (syntax: string) => void;
};

export const SqlList = ({
  sqlArray,
  sqlId,
  onSqlArrayChange,
  onSqlIdChange,
  onSqlSyntaxChange,
}: SqlListProps) => {
  const { isOpen, toggle } = useDisclosure(true);
  const [sqlNum, setSqlNum] = useSessionStorageState<number>("sqlNum", 5);

  // 區塊切換
  const handleSqlIdClick = (id: string) => {
    onSqlIdChange(id);
    // sql 語法改變
    const sqlItem = sqlArray.find((v) => v.id === id);
    const newSqlSyntax = sqlItem?.syntaxArray[sqlItem?.syntaxIndex || 0] || "";
    onSqlSyntaxChange(newSqlSyntax);
  };
  // 新增區塊
  const handleSqlArrayAdd = () => {
    onSqlArrayChange([...sqlArray, createSql(`SQL 語法${sqlNum + 1}`)]);
    setSqlNum(sqlNum + 1);
  };
  // 刪除區塊
  const handleSqlArrayDel = (id: string) => {
    // 區塊 > 1 再刪除
    if (sqlArray.length <= 1) {
      return;
    }
    const newArray = sqlArray.filter((v) => v.id !== id);
    // 選中的區塊 = 刪除的區塊，刪除後將 sqlId 設為下個區塊
    if (sqlId === id) {
      const delSqlIndex = sqlArray.findIndex((v) => v.id === id);
      const sqlIndex = delSqlIndex === newArray.length ? 0 : delSqlIndex;
      handleSqlIdClick(newArray[sqlIndex].id);
    }
    onSqlArrayChange(newArray);
  };

  return (
    <List>
      <ListItemButton onClick={toggle}>
        <ListItemText primary="SQL 區塊" />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List>
          {sqlArray.map((sql) => (
            <ListItemButton
              key={sql.id}
              sx={[sql.id === sqlId && { backgroundColor: "grey.200" }]}
              onClick={() => handleSqlIdClick(sql.id)}
            >
              <ListItemText primary={sql.id} sx={{ pl: 2 }} />
              <ListItemIcon
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation(); // 阻止冒泡事件
                  handleSqlArrayDel(sql.id);
                }}
              >
                <DeleteIcon />
              </ListItemIcon>
            </ListItemButton>
          ))}
          <ListItemButton sx={{ pl: 4 }} onClick={handleSqlArrayAdd}>
            <AddIcon />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
};
