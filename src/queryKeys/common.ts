import axiosInstance from "@/utils/axiosInstance";
import { IToken, IResponse, IAuth, IMemberInfo } from "@/utils/types";
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
      queryKey: [accessToken, refreshToken],
    }),
    info: () => ({
      queryFn: async () => {
        const { data } = await axiosInstance.get<IResponse<IMemberInfo>>(`/member/member`);
        return data.result;
      },
      queryKey: [""],
    }),
  },
});

export default queryKeyStore;
