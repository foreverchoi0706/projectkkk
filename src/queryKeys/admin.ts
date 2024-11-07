import axiosInstance from "@/utils/axiosInstance";
import {
  IAccount,
  IAuth,
  IBrand,
  IMember,
  IMemberInfo,
  IPageList,
  IProduct,
  IResponse,
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
    info: () => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IMemberInfo>>(`/member/member`);
        return data.result;
      },
      queryKey: [""],
    }),
  },
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
    all: (queryString: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IBrand[]>>>(
          `/admin/product/brands?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  members: {
    all: (queryString?: string) => ({
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
    all: (queryString: string) => ({
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
