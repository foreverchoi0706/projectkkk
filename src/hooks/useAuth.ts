import admin from "@/queryKeys/admin";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
import { deleteCookie, getCookie, hasCookie, setCookie } from "@/utils/cookie";
import { IAuth } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useAuth = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    ...admin.auth.verify({
      accessToken: getCookie(ACCESS_TOKEN)!,
      refreshToken: getCookie(REFRESH_TOKEN)!,
    }),
    enabled: hasCookie(ACCESS_TOKEN) && hasCookie(REFRESH_TOKEN),
  });

  const { data: info } = useQuery({
    ...admin.auth.info(),
    enabled: Boolean(query.data),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const login = ({ accessToken, refreshToken }: IAuth) => {
    setCookie(ACCESS_TOKEN, accessToken);
    setCookie(REFRESH_TOKEN, refreshToken);
    queryClient.invalidateQueries();
  };

  const logout = () => {
    alert("로그아웃되었습니다");
    deleteCookie(ACCESS_TOKEN);
    deleteCookie(REFRESH_TOKEN);
    queryClient.setQueryData<null>(admin.auth.info().queryKey, null);
    queryClient.setQueryData<null>(
      admin.auth.verify({
        accessToken: getCookie(ACCESS_TOKEN)!,
        refreshToken: getCookie(REFRESH_TOKEN)!,
      }).queryKey,
      null,
    );
  };

  return { ...query, info, login, logout };
};

export default useAuth;
