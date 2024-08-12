import { z } from "zod";
import { baseResponse } from "@appTypes/baseResponse";

const baseRoleTreeSchema = z.object({
  Id: z.number(),
  Name: z.string(),
  Title: z.string(),
  Status: z.number(),
});
type BaseRoleTree = z.infer<typeof baseRoleTreeSchema> & {
  children?: BaseRoleTree[];
};
const roleTreeSchema: z.ZodType<BaseRoleTree> = baseRoleTreeSchema
  .extend({
    Children: z.lazy(() => z.array(roleTreeSchema)).optional(),
  })
  .transform(({ Children, ...data }) => ({ ...data, children: Children }));

export type RoleTreeSchema = z.infer<typeof roleTreeSchema>;
export const roleTreeResponse = baseResponse.extend({
  Data: z.array(roleTreeSchema),
});
export type RoleTreeResponse = z.infer<typeof roleTreeResponse>;
