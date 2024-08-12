import { SideBar, ContentLayout } from "@components/Layout";
import {
  VendorSearch,
  ItemSearch,
  MemberSearch,
  useSrutilsSearch,
} from "@features/srutils";
import { useDisclosure } from "@hooks/useDisclosure";
import { useSessionStorageState } from "@hooks/useSessionStorageState";
import { SqlSearchData } from "./api";
import { SqlContent, SqlList } from "./components";
import { createSql } from "./utils";

const SqlSearchPage = () => {
  const { isOpen, toggle } = useDisclosure(true);

  // sql 區塊資料儲存
  const [sqlArray, setSqlArray] = useSessionStorageState<SqlSearchData[]>(
    "sqlArray",
    Array.from({ length: 5 }, (_, index) => createSql(`SQL 語法${index + 1}`))
  );
  // 選取的 sql 區塊 id
  const [sqlId, setSqlId] = useSessionStorageState<string>(
    "sqlId",
    "SQL 語法1"
  );
  // sql 語法
  const [sqlSyntax, setSqlSyntax] = useSessionStorageState<string>(
    "sqlSyntax",
    ""
  );
  // 目前選取區塊的資料
  const currentSql = sqlArray.find((sql) => sql.id === sqlId) || sqlArray[0];

  const handleSqlArrayChange = (array: SqlSearchData[]) => {
    setSqlArray(array);
  };
  const updateSqlArray = (...updates: { property: string; data: any }[]) => {
    const newSqlArray = sqlArray.map((sql) => {
      const updatedSql = updates.reduce(
        (acc, update) =>
          sql.id === sqlId ? { ...acc, [update.property]: update.data } : acc,
        sql
      );

      return updatedSql;
    });
    setSqlArray(newSqlArray);
  };
  const handleSqlIdChange = (id: string) => {
    setSqlId(id);
  };
  const handleSqlSyntaxChange = (syntax: string) => {
    setSqlSyntax(syntax);
  };

  const {
    vendor,
    handleVendorChange,
    item,
    handleItemChange,
    member,
    handleMemberChange,
  } = useSrutilsSearch();

  return (
    <>
      <SideBar isOpen={isOpen}>
        <SqlList
          sqlArray={sqlArray}
          sqlId={sqlId}
          onSqlArrayChange={handleSqlArrayChange}
          onSqlIdChange={handleSqlIdChange}
          onSqlSyntaxChange={handleSqlSyntaxChange}
        />
        <VendorSearch item={vendor} onItemChange={handleVendorChange} />
        <ItemSearch item={item} onItemChange={handleItemChange} />
        <MemberSearch item={member} onItemChange={handleMemberChange} />
      </SideBar>
      <ContentLayout isOpen={isOpen} toggle={toggle}>
        <SqlContent
          sqlSyntax={sqlSyntax}
          currentSql={currentSql}
          onSqlSyntaxChange={handleSqlSyntaxChange}
          updateSqlArray={updateSqlArray}
        />
      </ContentLayout>
    </>
  );
};

export default SqlSearchPage;
