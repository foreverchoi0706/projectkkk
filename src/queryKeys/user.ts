import axiosInstance from "@/utils/axiosInstance";
import {
  ICart,
  ICategory,
  ICoupon,
  INotification,
  IOrder,
  IPageList,
  IProduct,
  IProductDetail,
  IQnAWaiting,
  IQna,
  IResponse,
  IReview,
  IShipping,
} from "@/utils/types";
import { createQueryKeyStore } from "@lukemorales/query-key-factory";

const queryKeyStore = createQueryKeyStore({
  notification: {
    all: () => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<INotification[]>>>(
          `/notification/my_notification?page=1&size=9999`,
        );
        return data.result;
      },
      queryKey: [""],
    }),
  },
  cart: {
    pages: () => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<ICart[]>>>(`/cart/products_in_cart`);
        return data.result;
      },
      queryKey: [""],
    }),
  },
  brands: {
    all: () => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<string[]>>>(
          `/product/brands?page=1&size=9999`,
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
          `/category/categories?size=9999`,
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
          `/product/newProduct?size=20&page=${pageParam}`,
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
        const { data } = await axiosInstance.get<IResponse<IProduct & IProductDetail>>(
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
        const { data } = await axiosInstance.get<IResponse<IPageList<ICoupon[]>>>(
          "/coupon/search?size=9999",
        );
        return data.result;
      },
      queryKey: [""],
    }),
    pages: (queryString?: string) => ({
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await axiosInstance.get<IResponse<IPageList<ICoupon[]>>>(
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
          await axiosInstance.get<IResponse<IPageList<IQna[]>>>(`/qna/my_qna?size=9999`);
        return data.result;
      },
      queryKey: [queryString],
    }),
    detail: (id: number) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IQnAWaiting>>(
          `/qna/qna_detail?qnAId=${id}`,
        );
        return data.result;
      },
      queryKey: [id],
    }),
  },
  reviews: {
    all: (queryString?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IReview[]>>>(
          `/review/my_review?size=9999`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
    detail: (reviewId: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IReview>>(
          `/review/review?reviewId=${reviewId}`,
        );
        return data.result;
      },
      queryKey: [reviewId],
    }),
  },
  order: {
    all: () => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<IOrder[]>>>(`/order/my_order?size=9999`);
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
        const { data } = await axiosInstance.get<IResponse<IOrder>>(`/order/order?orderId=${id}`);
        return data.result;
      },
      queryKey: [id],
    }),
  },
  shipping: {
    detail: (id?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IShipping>>(
          `/shipping/shipping?shippingId=${id}`,
        );
        return data.result;
      },
      queryKey: [id],
    }),
    all: () => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IShipping[]>>>(
          `/admin/shipping/shippings?size=9999`,
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
