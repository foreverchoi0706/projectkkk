import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants.ts";
import { deleteCookie, getCookie, hasCookie, setCookie } from "@/utils/cookie.ts";
import {
  IAccount,
  IMember,
  IPageList,
  IProduct,
  IResponse,
  IToken,
  IUserInfo,
} from "@/utils/types.ts";
import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "/api" : "https://projectkkk.com/api/",
});

axiosInstance.interceptors.request.use((config) => {
  if (hasCookie(ACCESS_TOKEN)) config.headers.Authorization = `Bearer ${getCookie(ACCESS_TOKEN)}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (value) => value,
  async (error) => {
    const { config, response } = error;
    if (
      response.status === 401 &&
      !["/auth/login", "/auth/verify", "/api/member/join"].includes(config.url)
    ) {
      try {
        const { data } = await axiosInstance.post<IResponse<IUserInfo>>(
          `/auth/refresh?refreshToken=${getCookie(REFRESH_TOKEN)}`,
        );
        setCookie(ACCESS_TOKEN, data.result.accessToken);
        setCookie(REFRESH_TOKEN, data.result.refreshToken);
        location.reload();
      } catch {
        alert("로그아웃 되었습니다");
        deleteCookie(ACCESS_TOKEN);
        deleteCookie(REFRESH_TOKEN);
        location.replace("/signIn");
      }
      return;
    }
    return Promise.reject(response.data);
  },
);

const queryKeys = createQueryKeyStore({
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
  },
  accounts: {
    all: (queryString?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IAccount[]>>>(
          `/auth/authorities?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
  },
  brands: {
    all: (queryString: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<string[]>>>(
          `/product/brands?${queryString}`,
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
          `/member/search?${queryString}`,
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
          `/product/search?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
    detail: (productId: number) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IProduct>>(
          `/product/product?productId=${productId}`,
        );
        return data.result;
      },
      queryKey: [productId],
    }),
  },
});

export default queryKeys;
