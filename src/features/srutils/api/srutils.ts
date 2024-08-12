import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import {
  SRUtilsSearchType,
  displayListSchema,
  DisplayListSchema,
  displayMemberListSchema,
  DisplayMemberListSchema,
} from "./types";

const fetchItem = async (
  name: string,
  path: SRUtilsSearchType
): Promise<DisplayListSchema> => {
  const { data } = await axios.get(`/srutils/${path}`, {
    params: {
      q: name,
    },
  });
  return displayListSchema.parse(data);
};

export const useFetchItem = (name: string, path: SRUtilsSearchType) => {
  return useQuery({
    queryKey: [path, name],
    queryFn: () => fetchItem(name, path),
    enabled: !!name,
    initialData: [],
    select: (data): DisplayListSchema | DisplayMemberListSchema => {
      if (path === SRUtilsSearchType.Member) {
        const newData = data.map((item) => {
          const [name, , loginEmail, loginMobile, mobile, tel, addr] =
            item.Display.split(",");
          return {
            Key: item.Key,
            Display: item.Display,
            name: name,
            loginEmail: loginEmail,
            loginMobile: loginMobile,
            mobile: mobile,
            tel: tel,
            addr: addr,
          };
        });
        return displayMemberListSchema.parse(newData);
      }
      return displayListSchema.parse(data);
    },
  });
};
