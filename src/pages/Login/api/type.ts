import { z } from "zod";

export enum LoginType {
  Login = "/login",
  Winnie = "/login/winnie",
  Ad = "/login/ad",
}

export const fetchLoginPayload = z.object({
  option: z.nativeEnum(LoginType),
  acc: z.string().toUpperCase().min(1, "請輸入帳號"),
  pwd: z.string().min(1, "請輸入密碼"),
});
export type FetchLoginPayload = z.infer<typeof fetchLoginPayload>;
