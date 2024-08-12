import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import {
  sqlSearchResponse,
  SqlSearchResponse,
  SqlSearchPayload,
  SqlSearchType,
} from "./types";

const fetchSqlExecute = async ({
  db,
  inputText,
  action,
}: SqlSearchPayload): Promise<SqlSearchResponse> => {
  const query = { DbName: db, Sql: inputText };
  const path = `/wcf/${action}`;

  const { data } = await axios.post(path, query);
  return sqlSearchResponse.parse(data);
};

export const useSqlExecute = (
  id: string,
  { db, inputText, action }: SqlSearchPayload
) =>
  useQuery({
    queryKey: [
      "wcf",
      action === SqlSearchType.executePlan
        ? SqlSearchType.executePlan
        : SqlSearchType.executeQuery,
      id,
    ],
    queryFn: () => fetchSqlExecute({ db, inputText, action }),
    enabled: false,
  });
