import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import { useAuthStore } from "@store/auth";
import { RootMenuSchema, rootMenuSchema } from "./type";

const fetchUserRoot = async (rootName?: string): Promise<RootMenuSchema> => {
  const { data } = await axios.get("/menu/userRoot", {
    params: {
      n: rootName,
    },
  });
  return rootMenuSchema.parse(data);
};
export const useFetchUserRoot = (rootName?: string) => {
  const { auth } = useAuthStore();
  return useQuery({
    queryKey: ["userRoot", rootName],
    queryFn: () => fetchUserRoot(rootName),
    enabled: auth,
  });
};
