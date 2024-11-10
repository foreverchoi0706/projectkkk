import axiosInstance from "@/utils/axiosInstance";
import {
  Coupon,
  ICategory,
  IPageList,
  IProduct,
  IQna,
  IResponse,
  IShipping,
  ITest,
} from "@/utils/types";
import { createQueryKeyStore } from "@lukemorales/query-key-factory";

const queryKeyStore = createQueryKeyStore({
  brands: {
    all: () => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<string[]>>>(
          `/product/brands?page=1&size=100`,
        );
        return data.result;
      },
      queryKey: [""],
    }),
  },
  categories: {
    all: () => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<ICategory[]>>>(`/category/categories`);
        return data.result;
      },
      queryKey: [""],
    }),
  },
  products: {
    new: (pageParam?: number) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IProduct[]>>>(
          `/product/newProduct?size=15&page=${pageParam}`,
        );
        return data.result;
      },
      queryKey: [pageParam],
    }),
    all: (queryString: string) => ({
      queryFn: async ({ pageParam }) => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IProduct[]>>>(
          `/product/products?page=${pageParam}&${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
    detail: (id?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IProduct & ITest>>(
          `/product/product?productId=${id}`,
        );
        return data.result;
      },
      queryKey: [id],
    }),
    wish: () => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<IProduct[]>>>(`/wishList/my_wishList`);
        return data.result;
      },
      queryKey: [""],
    }),
  },
  coupons: {
    all: (queryString?: string) => ({
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await axiosInstance.get<IResponse<IPageList<Coupon[]>>>(
          `/coupon/search?page=${pageParam}&${queryString || ""}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
    detail: (id?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<unknown>>>(
          `/coupon/coupon?couponId=${id}`,
        );
        return data.result;
      },
      queryKey: [id],
    }),
  },
  qnas: {
    all: (queryString?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IQna[]>>>(`/qna/qnas`);
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  reviews: {
    all: (queryString?: string) => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<IQna[]>>>(`/review/my_reiveiw`);
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  shipping: {
    all: () => ({
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IShipping[]>>>(
          `/admin/shipping/shippings?size=10&page=${pageParam}`,
        );
        return data.result;
      },
      queryKey: [""],
    }),
  },
});

export default queryKeyStore;
