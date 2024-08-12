import { z } from "zod";

export const baseResponse = z.object({
  Code: z.string(),
  Msg: z.string(),
});

export type BaseResponse = z.infer<typeof baseResponse>;
