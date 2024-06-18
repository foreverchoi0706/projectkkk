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
        return data.result;
      },
      queryKey: [""],
    }),
  },
  members: {
    detail: (memberId: number) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IProduct>>(
          `/member/findMemberById?MemberId=${memberId}`,
        );
        return data.result;
      },
      queryKey: [memberId],
    }),
    all: (queryString?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IMember[]>>>(
          `/member/searchMembers?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  products: {
    detail: (productId: number) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IProduct>>(
          `/product/DetailProduct?productId=${productId}`,
        );
        return data.result;
      },
      queryKey: [productId],
    }),
    all: (queryString: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IProduct[]>>>(
          `/product/searchProducts?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
});

export default queryKeys;
