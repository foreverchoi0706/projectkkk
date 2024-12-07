import axiosInstance from "@/utils/axiosInstance";
import {
  IAccount,
  IBrand,
  ICoupon,
  IMember,
  IPageList,
  IProduct,
  IQnAWaiting,
  IResponse,
  IShipping,
} from "@/utils/types";
import { createQueryKeyStore } from "@lukemorales/query-key-factory";

const queryKeyStore = createQueryKeyStore({
  accounts: {
    all: (queryString?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IAccount[]>>>(
          `/admin/auth/authorities?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  brands: {
    pages: (queryString: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IBrand[]>>>(
          `/admin/product/brands?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  qnas: {
    pages: (queryString: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IQnAWaiting[]>>>(
          `/admin/qna/qnas?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  coupons: {
    pages: (queryString: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<ICoupon[]>>>(
          `/admin/coupon/search?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  shippings: {
    pages: (queryString: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IShipping[]>>>(
          `/admin/shipping/shippings?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  members: {
    pages: (queryString?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IMember[]>>>(
          `/admin/member/search?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
    detail: () => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IMember>>("/member/member");
        return data.result;
      },
      queryKey: [""],
    }),
  },
  products: {
    pages: (queryString: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IProduct[]>>>(
          `/admin/product/search?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
    detail: (productId: number) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IProduct>>(
          `/admin/product/product?productId=${productId}`,
        );
        return data.result;
      },
      queryKey: [productId],
    }),
  },
});

export default queryKeyStore;
