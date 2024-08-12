import { z } from "zod";

export const userInfoSchema = z.object({
  UserId: z.number(),
  Name: z.string(),
  StaffNo: z.string(),
  Status: z.number(),
  CreatedAt: z.string(),
});

export type UserInfoSchema = z.infer<typeof userInfoSchema>;
