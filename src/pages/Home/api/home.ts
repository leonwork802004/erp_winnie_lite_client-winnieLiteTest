import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import { UserInfoSchema, userInfoSchema } from ".";

const fetchUserInfo = async (): Promise<UserInfoSchema> => {
  const { data } = await axios.get("/user/info");
  return userInfoSchema.parse(data);
};

export const useFetchUserInfo = () =>
  useQuery({ queryKey: ["/user/info"], queryFn: fetchUserInfo });
