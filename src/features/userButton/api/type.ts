import { z } from "zod";

const buttonInfo = z.object({
  Title: z.string(),
  Id: z.number(),
  FeatureName: z.string(),
});

export const buttonInfoSchema = z.array(buttonInfo);
export type ButtonInfoSchema = z.infer<typeof buttonInfoSchema>;

export type ButtonDefinition = {
  featureName: string;
  element: JSX.Element;
};
