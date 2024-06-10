import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import { IMember, IPageList, IProduct, IResponse } from "@/utils/types.ts";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "/api" : "https://projectkkk.com/api/",
});

const queryKeys = createQueryKeyStore({
  brands: {
    all: () => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IProduct[]>>>("/brands");
        return data;
      },
      queryKey: [""],
    }),
  },
  members: {
    all: (memberId?: string) => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<IMember[]>>>("/member/FindAllMember");
        return data;
      },
      queryKey: [memberId],
    }),
  },
  products: {
    detail: (productId: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IProduct>>(
          `/product/DetailProduct?productName=${productId}`,
        );
        return data.result;
      },
      queryKey: [productId],
    }),
    all: (queryString: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IProduct[]>>>(
          `/product/FindProduct?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
});

export default queryKeys;
