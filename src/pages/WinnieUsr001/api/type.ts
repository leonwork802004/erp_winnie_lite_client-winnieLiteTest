import { formatDate } from "@utils/formatDate";
import { z } from "zod";
import { baseResponse } from "@appTypes/baseResponse";

export type FetchWinnieUserPayload = {
  acct: string;
  name: string;
  empNo: string;
  usrNo: string;
};

const winnieUserSchema = z
  .object({
    Id: z.string(),
    Acct: z.string(),
    Name: z.string(),
    EmpNo: z.string(),
    DepNo: z.string(),
    CrewNo: z.string(),
    Email: z.string(),
    LoginIp: z.string(),
    PwdModDtm: z.string().optional(),
    Status: z.string(),
    CreDtm: z.string().optional(),
    CreMan: z.string(),
    ModDtm: z.string().optional(),
    ModMan: z.string(),
    Memo: z.string().optional(),
  })
  .transform((v) => ({
    ...v,
    PwdModDtm: formatDate(v.PwdModDtm),
    CreDtm: formatDate(v.CreDtm),
    ModDtm: formatDate(v.ModDtm),
    Status: v.Status === "0" ? "否" : v.Status === "1" ? "是" : "",
  }));
const winnieUserListSchema = z.array(winnieUserSchema);
export type WinnieUserSchema = z.infer<typeof winnieUserSchema>;

export const fetchWinnieUserRes = baseResponse.extend({
  Data: winnieUserListSchema,
});
export type FetchWinnieUserRes = z.infer<typeof fetchWinnieUserRes>;

export enum UpdateWinnieUser {
  unlock = "unlock",
  unlock15D = "unlock15D",
  resetPassword = "resetPassword",
}
