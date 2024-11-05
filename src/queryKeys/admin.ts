import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
import { deleteCookie, getCookie, hasCookie } from "@/utils/cookie";
import {
  IAccount,
  IBrand,
  IMember,
  IMemberInfo,
  IPageList,
  IProduct,
  IResponse,
  IToken,
  IUserInfo,
} from "@/utils/types";
import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "/api" : "https://34.64.87.216/api/",
});

axiosInstance.interceptors.request.use((config) => {
  if (hasCookie(ACCESS_TOKEN)) config.headers.Authorization = `Bearer ${getCookie(ACCESS_TOKEN)}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (value) => value,
  async (error) => {
    const { config, response } = error;
    if (config.url.includes("/auth/verify")) {
      alert("로그아웃 되었습니다");
      deleteCookie(ACCESS_TOKEN);
      deleteCookie(REFRESH_TOKEN);
      location.replace("/signIn");
    }
    return Promise.reject(response.data);
  },
);

const queryKeyStore = createQueryKeyStore({
  auth: {
    verify: ({ accessToken, refreshToken }: IToken) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IUserInfo>>(
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
