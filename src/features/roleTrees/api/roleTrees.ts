import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import { RoleTreeResponse, roleTreeResponse } from ".";

const fetchRoleTrees = async (): Promise<RoleTreeResponse> => {
  const { data } = await axios.get("/role/trees");
  return roleTreeResponse.parse(data);
};
export const useFetchRoleTrees = () =>
  useQuery({
    queryKey: ["role", "trees"],
    queryFn: fetchRoleTrees,
  });
