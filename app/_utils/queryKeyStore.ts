import { createQueryKeyStore } from "@lukemorales/query-key-factory";

import fetcher from "@/app/_utils/fetcher";
import { Member, Product } from "@/app/_utils/types";

const queryKeyStore = createQueryKeyStore({
  brands: {
    all: () => ({
      queryFn: () => fetcher.get<string[]>("/api/brands"),
      queryKey: [""],
    }),
  },
  members: {
    all: (memberId?: string) => ({
      queryFn: async () => {
        const { result } = await fetcher.get<Member[]>(
          "/api/members?page=0&size=10&sort=id",
        );
        return result;
      },
      queryKey: [memberId],
    }),
  },
  products: {
    all: (productId?: string) => ({
      queryFn: async () => {
        const { result } = await fetcher.get<Product[]>(
          "/api/products?page=0&size=10&sort=id",
        );
        return result;
      },
      queryKey: [productId],
    }),
  },
});

export default queryKeyStore;
