import { DefaultOptions, QueryClient, QueryCache } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ZodError } from "zod";

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error instanceof ZodError) {
        console.error(error);
      }
      const message =
        error.response?.data?.Msg ||
        error.response?.data ||
        error.response?.statusText ||
        error.message;
      toast.error(message);
    },
  }),
});
