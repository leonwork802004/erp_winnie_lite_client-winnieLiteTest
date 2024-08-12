import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import { ButtonInfoSchema, buttonInfoSchema } from "./type";

const fetchUserPage = async (page: string): Promise<ButtonInfoSchema> => {
  const { data } = await axios.get("/button/userPage", {
    params: { page },
  });
  return buttonInfoSchema.parse(data);
};

export const useFetchUserPage = (page: string) => {
  return useQuery({
    queryKey: ["button", "userPage", page],
    queryFn: () => fetchUserPage(page),
    select: (data) => {
      const featureNames: string[] = data.map((item) => item.FeatureName);

      return { response: data, featureNames };
    },
  });
};
