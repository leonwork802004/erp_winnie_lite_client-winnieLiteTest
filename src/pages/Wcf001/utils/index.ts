import { SqlSearchData } from "../api";

export const createSql = (id: string): SqlSearchData => ({
  id,
  db: "ECDB",
  action: "查詢",
  syntaxArray: [],
  syntaxIndex: -1,
});
