import { z } from "zod";
import { baseResponse } from "@appTypes/baseResponse";

//取得站台測試功能內容
const siteContentSchema = z.object({
  OSName: z.string(),
  AppName: z.string(),
  Version: z.string(),
  AppPath: z.string(),
  LogPath: z.string(),
});

export type SiteContentSchema = z.infer<typeof siteContentSchema>;

export const fetchSiteContentResponse = baseResponse.extend({
  Data: siteContentSchema,
});

export type FetchSiteContentResponse = z.infer<typeof fetchSiteContentResponse>;

//測試站台連線
const connResSchema = z.object({
  Name: z.string(),
  Url: z.string(),
  Code: z.number(),
  Content: z.string(),
});

export type ConnResSchema = z.infer<typeof connResSchema>;

export const fetchConnResResponse = baseResponse.extend({
  Data: z.array(connResSchema),
});

export type FetchConnResponse = z.infer<typeof fetchConnResResponse>;
