import { useQueryClient } from "@tanstack/react-query";
import type { INITIAL_STORE } from "./useQueryStore";

type TStoreUnion = {
  [K in keyof typeof INITIAL_STORE]: {
    key: K;
    value: (typeof INITIAL_STORE)[K];
  };
}[keyof typeof INITIAL_STORE];

const useQuerySelector = (key: keyof typeof INITIAL_STORE) => {
  const queryClient = useQueryClient();

  return (queryClient.getQueryData<TStoreUnion>(["store", key])?.value) || null;
};

export default useQuerySelector;
