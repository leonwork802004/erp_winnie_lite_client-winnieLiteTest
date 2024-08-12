import { z } from "zod";

export const jwtAuthSchema = z.object({
  AccessTokenExpires: z.string(),
  RefreshTokenExpires: z.string(),
});

export type JwtAuthSchema = z.infer<typeof jwtAuthSchema>;
