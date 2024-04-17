import { createQueryKeyStore } from "@lukemorales/query-key-factory";

const queryKeyStore = createQueryKeyStore({
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
        fetch("/api/products")
          .then((response) => response.json())
          .then((jsonResponse) => jsonResponse)
          .catch(console.error),
      queryKey: [productId],
    }),
  },
});

export default queryKeyStore;
