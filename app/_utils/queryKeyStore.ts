import { createQueryKeyStore } from "@lukemorales/query-key-factory";

import fetcher from "@/app/_utils/fetcher";
import { Product } from "@/app/_utils/types";

const queryKeyStore = createQueryKeyStore({
  brands: {
    all: () => ({
      queryFn: () => fetcher.get<string[]>("/api/brands"),
      queryKey: [""],
    }),
  },
  members: {
    all: (memberId?: string) => ({
      queryFn: () =>
        fetch("/api/members")
          .then((response) => response.json())
          .then((jsonResponse) => jsonResponse)
          .catch(console.error),
      queryKey: [memberId],
    }),
  },
  products: {
    all: (productId?: string) => ({
      queryFn: () =>
        fetcher.get<Product[]>("/api/products?page=0&size=10&sort=id"),
      queryKey: [productId],
    }),
  },
});

export default queryKeyStore;
