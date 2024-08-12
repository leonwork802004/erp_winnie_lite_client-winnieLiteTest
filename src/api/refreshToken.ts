import { jwtAuthSchema, JwtAuthSchema } from "@appTypes/auth";
import axios from "@lib/axios";

export const fetchRefreshToken = async (): Promise<JwtAuthSchema> => {
  const { data } = await axios.post("/auth/refreshToken");
  localStorage["AccessTokenExpires"] = data.AccessTokenExpires.toString();
  localStorage["RefreshTokenExpires"] = data.RefreshTokenExpires.toString();

  return jwtAuthSchema.parse(data);
};
