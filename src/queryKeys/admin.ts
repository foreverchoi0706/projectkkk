import { ADMIN_ACCESS_TOKEN, ADMIN_REFRESH_TOKEN } from "@/utils/constants";
import { deleteCookie, getCookie, hasCookie, setCookie } from "@/utils/cookie";
import {
  IAccount,
  IBrand,
  IMember,
  IPageList,
  IProduct,
  IResponse,
  IToken,
  IUserInfo,
} from "@/utils/types";
import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import axios from "axios";
``;
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "/api" : "https://www.projectkkk.com/api/",
});

axiosInstance.interceptors.request.use((config) => {
  if (hasCookie(ADMIN_ACCESS_TOKEN))
    config.headers.Authorization = `Bearer ${getCookie(ADMIN_ACCESS_TOKEN)}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (value) => value,
  async (error) => {
    const { config, response } = error;
    if (
      response.status === 401 &&
      !["/auth/login", "/auth/verify", "/api/member/join", "/api/auth/refresh"].includes(config.url)
    ) {
      alert("로그아웃 되었습니다");
      deleteCookie(ADMIN_ACCESS_TOKEN);
      deleteCookie(ADMIN_REFRESH_TOKEN);
      location.replace("/signIn");
      //   try {
      //     const { data } = await axiosInstance.post<IResponse<IUserInfo>>(
      //       `/auth/refresh?refreshToken=${getCookie(ADMIN_REFRESH_TOKEN)}`,
      //     );
      //     setCookie(ADMIN_ACCESS_TOKEN, data.result.accessToken);
      //     setCookie(ADMIN_REFRESH_TOKEN, data.result.refreshToken);
      //     location.reload();
      //   } catch {
      //     alert("로그아웃 되었습니다");
      //     deleteCookie(ADMIN_ACCESS_TOKEN);
      //     deleteCookie(ADMIN_REFRESH_TOKEN);
      //     location.replace("/signIn");
      //   }
      //   return;
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
