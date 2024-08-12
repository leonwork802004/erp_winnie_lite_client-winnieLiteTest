import { z } from "zod";
import { baseResponse } from "@appTypes/baseResponse";

export enum SqlSearchType {
  executeQuery = "executeQuery",
  executeNonQuery = "executeNonQuery",
  executePlan = "executePlan",
}

const sqlSearchPayload = z.object({
  db: z.string(),
  inputText: z.string().min(1),
  action: z.nativeEnum(SqlSearchType),
});
export type SqlSearchPayload = z.infer<typeof sqlSearchPayload>;

export const sqlSearchResponse = baseResponse.extend({
  Data: z
    .object({
      Table: z.any().array(),
    })
    .optional(),
});
export type SqlSearchResponse = z.infer<typeof sqlSearchResponse>;

export type SqlSearchData = {
  readonly id: string; // 語法區塊
  db: string;
  action: string;
  syntaxArray: string[]; // 儲存語法陣列
  syntaxIndex: number; // 當前語法 index
};
