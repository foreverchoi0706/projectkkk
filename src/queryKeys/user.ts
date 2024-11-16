import axiosInstance from "@/utils/axiosInstance";
import {
  Coupon,
  ICategory,
  IOrder,
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
          `/product/brands?page=1&size=1000`,
        );
        return data.result;
      },
      queryKey: [""],
    }),
  },
  categories: {
    all: () => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<ICategory[]>>>(
          `/category/categories?size=1000`,
        );
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
    pages: (queryString: string) => ({
      queryFn: async ({ pageParam }) => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IProduct[]>>>(
          `/product/search?page=${pageParam}&${queryString}`,
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
    all: () => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<Coupon[]>>>(`/coupon/search?size=1000`);
        return data.result;
      },
      queryKey: [""],
    }),
    pages: (queryString?: string) => ({
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await axiosInstance.get<IResponse<IPageList<Coupon[]>>>(
          `/coupon/search?page=${pageParam}&${queryString || ""}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  qnas: {
    all: (queryString?: string) => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<IQna[]>>>(`/qna/qnas?size=1000`);
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  reviews: {
    all: (queryString?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IQna[]>>>(
          `/review/my_reiveiw?size=1000`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  order: {
    all: () => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<IOrder[]>>>(`/order/my_order?size=1000`);
        return data.result;
      },
      queryKey: [""],
    }),
    pages: () => ({
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IOrder[]>>>(
          `/order/my_order?size=10&page=${pageParam}`,
        );
        return data.result;
      },
      queryKey: [""],
    }),
    detail: (id?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IShipping[]>>>(
          `/order/order?orderId=${id}`,
        );
        return data.result;
      },
      queryKey: [id],
    }),
  },
  shipping: {
    detail: (id?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IShipping[]>>>(
          `/shipping/shipping?shippingId=${id}`,
        );
        return data.result;
      },
      queryKey: [id],
    }),
    all: () => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IShipping[]>>>(
          `/admin/shipping/shippings?size=1000`,
        );
        return data.result;
      },
      queryKey: [""],
    }),
    pages: () => ({
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
