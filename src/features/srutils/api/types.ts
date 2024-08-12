import { z } from "zod";

const displayItemSchema = z.object({
  Key: z.string(),
  Display: z.string(),
});
export type DisplayItemSchema = z.infer<typeof displayItemSchema>;

export const displayListSchema = z.array(displayItemSchema);
export type DisplayListSchema = z.infer<typeof displayListSchema>;

const displayMemberItemSchema = displayItemSchema.extend({
  name: z.string(),
  loginEmail: z.string(),
  loginMobile: z.string(),
  mobile: z.string(),
  tel: z.string(),
  addr: z.string(),
});
export type DisplayMemberItemSchema = z.infer<typeof displayMemberItemSchema>;

export const displayMemberListSchema = z.array(displayMemberItemSchema);
export type DisplayMemberListSchema = z.infer<typeof displayMemberListSchema>;

export enum SRUtilsSearchType {
  Vendor = "Vendor",
  Item = "Item",
  Member = "Member",
}
