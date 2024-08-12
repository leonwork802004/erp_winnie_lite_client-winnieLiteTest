import { z } from "zod";

const baseMenuSchema = z.object({
  Id: z.number(),
  Title: z.string(),
  Priority: z.number(),
  FeatureName: z.string().optional(),
});

type Menu = z.infer<typeof baseMenuSchema> & {
  children?: Menu[];
};

const menuSchema: z.ZodType<Menu> = baseMenuSchema
  .extend({
    Children: z.lazy(() => z.array(menuSchema)).optional(),
  })
  .transform(({ Children, ...data }) => ({ ...data, children: Children }));
export type MenuSchema = z.infer<typeof menuSchema>;

export const rootMenuSchema = z.object({
  Id: z.number(),
  Title: z.string(),
  RootName: z.string(),
  Children: z.array(menuSchema),
});
export type RootMenuSchema = z.infer<typeof rootMenuSchema>;
