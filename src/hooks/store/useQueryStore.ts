import { useQueries } from "@tanstack/react-query";

export const INITIAL_STORE = {
  TEST: "TEST_VALUE",
  TEST2: "TEST2_VALUE",
} as const;

const useQueryStore = () => {
  useQueries({
    queries: Object.entries(INITIAL_STORE).map(([key, value]) => {
      return {
        queryKey: ["store", key],
        queryFn: () => ({ key, value }),
        initialData: { key, value },
      };
    }),
  });
};

export default useQueryStore;
