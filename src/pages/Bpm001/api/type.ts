import { z } from "zod";
import { baseResponse } from "@appTypes/baseResponse";

export type FetchDepPayload = {
  depNo: string;
  depNameLike: string;
  exclHist: number;
};

const depSchema = z.object({
  DepId: z.string(),
  DepNo: z.string(),
  DepName: z.string(),
  DepManagerUserName: z.string(),
  ParentDepId: z.string(),
  ParentDepNo: z.string(),
  ParentDepName: z.string(),
  ParentManagerUserName: z.string(),
});

export type DepSchema = z.infer<typeof depSchema>;

export const depListSchema = z.array(depSchema);
export const fetchDepResponse = baseResponse.extend({
  Data: z.array(depSchema),
});

export type FetchDepResponse = z.infer<typeof fetchDepResponse>;
