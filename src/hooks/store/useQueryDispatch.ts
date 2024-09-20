import { useQueryClient } from "@tanstack/react-query";
import { INITIAL_STORE } from "./useQueryStore";

const useQueryDispatch = () => {
  const queryClient = useQueryClient();

  return (key: keyof typeof INITIAL_STORE, value: unknown) => {
    queryClient.setQueryData<unknown>(["store", key], (input: unknown) => {
      if (!input) return input;
      return { ...input, value };
    });
  };
};

export default useQueryDispatch;
