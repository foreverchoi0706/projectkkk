import { useQueryClient } from "@tanstack/react-query";
import { INITIAL_STORE } from "./useQueryStore";

const useQueryDispatch = <_T>() => {
  const queryClient = useQueryClient();

  return (key: keyof typeof INITIAL_STORE, value: unknown) => {
    queryClient.setQueryData<{ key: keyof typeof INITIAL_STORE; value: unknown }>(
      ["store", key],
      (input) => {
        if (!input) return input;
        return { key: input.key, value };
      },
    );
  };
};

export default useQueryDispatch;
