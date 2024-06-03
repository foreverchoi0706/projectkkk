import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import { IMember, IPageList, IProduct, IResponse } from "@/utils/types.ts";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://projectkkk.com/api",
});

const queryKeys = createQueryKeyStore({
  brands: {
    all: () => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<IProduct[]>>>(
            "/api/brands",
          );
        return data;
      },
      queryKey: [""],
    }),
  },
  members: {
    all: (memberId?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<
          IResponse<IPageList<IMember[]>>
        >("/product/FindAllProduct");
        return data;
      },
      queryKey: [memberId],
    }),
  },
  products: {
    all: (productId?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<
          IResponse<IPageList<IProduct[]>>
        >("/member/FindAllMember");
        return data;
      },
      queryKey: [productId],
    }),
  },
});

export default queryKeys;
