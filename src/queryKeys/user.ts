import { axiosInstance } from "@/queryKeys/admin";
import {
  Coupon,
  IAuth,
  ICategory,
  IPageList,
  IProduct,
  IQna,
  IResponse,
  IShipping,
  IToken,
} from "@/utils/types";
import { createQueryKeyStore } from "@lukemorales/query-key-factory";

const queryKeyStore = createQueryKeyStore({
  auth: {
    verify: ({ accessToken, refreshToken }: IToken) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IAuth>>(
          `/auth/verify?accessToken=${accessToken}&refreshToken=${refreshToken}`,
        );
        return data.result;
      },
      queryKey: [""],
    }),
  },
  category: {
    all: () => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<ICategory[]>>>(`/category/categories`);
        return data.result;
      },
      queryKey: [""],
    }),
  },
  coupons: {
    all: (queryString?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<Coupon[]>>>(
          `/coupon/search?${queryString || ""}`,
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
        const { data } = await axiosInstance.get<IResponse<IProduct>>(
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
  qnas: {
    all: (queryString: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IQna[]>>>(`/qna/qnas`);
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  reviews: {
    all: (queryString: string) => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<IQna[]>>>(`/review/my_reiveiw`);
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  shipping: {
    all: (queryString: string) => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<IShipping[]>>>(`/admin/shipping/shippings`);
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
});

export default queryKeyStore;
