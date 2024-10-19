import { axiosInstance } from "@/queryKeys/admin";
import { ICategory, IPageList, IProduct, IResponse, IToken, IUserInfo } from "@/utils/types";
import { createQueryKeyStore } from "@lukemorales/query-key-factory";

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
  products: {
    new: () => ({
      queryFn: async () => {
        const { data } =
          await axiosInstance.get<IResponse<IPageList<IProduct[]>>>(`/product/newProduct`);
        return data.result;
      },
      queryKey: [""],
    }),
    all: (pageParam?: number) => ({
      queryFn: async () => {
        console.log(pageParam);
        const { data } = await axiosInstance.get<IResponse<IPageList<IProduct[]>>>(
          `/product/products?size=15&page=${pageParam}`,
        );
        return data.result;
      },
      queryKey: [""],
    }),
  },
});

export default queryKeyStore;
