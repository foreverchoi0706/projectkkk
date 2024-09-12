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

axiosInstance.interceptors.request.use((value) => {
  if (hasCookie(ACCESS_TOKEN)) value.headers.Authorization = `Bearer ${getCookie(ACCESS_TOKEN)}`;
  return value;
});

axiosInstance.interceptors.response.use(
  (value) => value,
  async (error) => {
    const { config, response } = error;
    if (response.status === 401 && !["/auth/login", "/auth/verify"].includes(config.url)) {
      try {
        const { data } = await axiosInstance.post<IResponse<IUserInfo>>(`/auth/refresh?refreshToken=${getCookie(REFRESH_TOKEN)}`);
        setCookie(ACCESS_TOKEN, data.result.accessToken);
        setCookie(REFRESH_TOKEN, data.result.refreshToken);
        location.reload()
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
      queryKey: [accessToken, refreshToken],
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IUserInfo>>(
          `/auth/verify?accessToken=${accessToken}&refreshToken=${refreshToken}`,
        );
        return data.result;
      },
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
    all: () => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IProduct[]>>>("/brands");
        return data.result;
      },
      queryKey: [""],
    }),
  },
  members: {
    all: (queryString?: string) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IPageList<IMember[]>>>(
          `/member/members?${queryString}`,
        );
        return data.result;
      },
      queryKey: [queryString],
    }),
    detail: (memberId: number) => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IProduct>>(
          `/member/member?memberId=${memberId}`,
        );
        return data.result;
      },
      queryKey: [memberId],
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
