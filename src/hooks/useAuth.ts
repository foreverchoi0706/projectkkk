import admin from "@/queryKeys/admin";
import { ADMIN_ACCESS_TOKEN, ADMIN_REFRESH_TOKEN } from "@/utils/constants";
import { deleteCookie, getCookie, hasCookie, setCookie } from "@/utils/cookie";
import { IUserInfo } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useAuth = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    ...admin.auth.verify({
      accessToken: getCookie(ADMIN_ACCESS_TOKEN)!,
      refreshToken: getCookie(ADMIN_REFRESH_TOKEN)!,
    }),
    enabled: hasCookie(ADMIN_ACCESS_TOKEN) && hasCookie(ADMIN_REFRESH_TOKEN),
  });

  const { data: info } = useQuery({
    ...admin.auth.info(),
    enabled: Boolean(query.data),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const login = ({ accessToken, refreshToken }: IUserInfo) => {
    setCookie(ADMIN_ACCESS_TOKEN, accessToken);
    setCookie(ADMIN_REFRESH_TOKEN, refreshToken);
    queryClient.invalidateQueries();
  };

  const logout = () => {
    alert("로그아웃되었습니다");
    deleteCookie(ADMIN_ACCESS_TOKEN);
    deleteCookie(ADMIN_REFRESH_TOKEN);
    queryClient.setQueryData<null>(admin.auth.info().queryKey, null);
    queryClient.setQueryData<null>(
      admin.auth.verify({
        accessToken: getCookie(ADMIN_ACCESS_TOKEN)!,
        refreshToken: getCookie(ADMIN_REFRESH_TOKEN)!,
      }).queryKey,
      null,
    );
  };

  return { ...query, info, login, logout };
};

export default useAuth;
