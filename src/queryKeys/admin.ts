import axiosInstance from "@/utils/axiosInstance";
import {
  IAccount,
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
        const { data } = await axiosInstance.get<IResponse<IPageList<string[]>>>(
          `/admin/product/brands?${queryString}`,
        );
        return {
          ...data.result,
          content: data.result.content.map((name) => ({ name })),
        };
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
    detail: (couponId: number) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<ICoupon>>(
          `/admin/coupon/coupon?couponId=${couponId}`,
        );
        return data.result;
      },
      queryKey: [couponId],
    }),
  },
  shippings: {
    pages: (queryString: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IShipping[]>>>(
          `/admin/shipping/search?${queryString}`,
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
    sales: (queryString?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IProduct[]>>>(
          queryString?.includes("sort")
            ? `/admin/sales/sales_ranking?${queryString}`
            : `/admin/sales/sold_products?${queryString}`,
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
