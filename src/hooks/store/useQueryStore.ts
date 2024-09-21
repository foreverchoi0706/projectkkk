import { useQueries } from "@tanstack/react-query";

export const INITIAL_STORE = {
  TEST: "TEST_VALUE",
  TEST2: "TEST2_VALUE",
  TEST3: 1,
};

const useQueryStore = () => {
  useQueries({
    queries: Object.entries(INITIAL_STORE).map(([key, value]) => ({
      queryKey: ["store", key],
      initialData: { key, value },
    })),
  });
};

export default useQueryStore;
