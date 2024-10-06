import {
  ADMIN_ACCESS_TOKEN,
  ADMIN_REFRESH_TOKEN,
  USER_ACCESS_TOKEN,
  USER_REFRESH_TOKEN,
} from "@/utils/constants";
import { deleteCookie, getCookie, hasCookie, setCookie } from "@/utils/cookie";
import queryKeys from "@/utils/queryKeys";
import { IUserInfo } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useAuth = () => {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery({
    ...queryKeys.auth.verify({
      accessToken: getCookie(ADMIN_ACCESS_TOKEN)!,
      refreshToken: getCookie(ADMIN_REFRESH_TOKEN)!,
    }),
    enabled: hasCookie(ADMIN_ACCESS_TOKEN) && hasCookie(ADMIN_REFRESH_TOKEN),
  });

  const login = ({ accessToken, refreshToken }: IUserInfo) => {
    setCookie(ADMIN_ACCESS_TOKEN, accessToken);
    setCookie(ADMIN_REFRESH_TOKEN, refreshToken);
    queryClient.invalidateQueries();
  };

  const logout = () => {
    alert("로그아웃되었습니다");
    deleteCookie(USER_ACCESS_TOKEN);
    deleteCookie(USER_REFRESH_TOKEN);
    deleteCookie(ADMIN_ACCESS_TOKEN);
    deleteCookie(ADMIN_REFRESH_TOKEN);
    queryClient.setQueryData<null>(
      queryKeys.auth.verify({
        accessToken: getCookie(ADMIN_ACCESS_TOKEN)!,
        refreshToken: getCookie(ADMIN_REFRESH_TOKEN)!,
      }).queryKey,
      null,
    );
  };

  return { auth: data, ...rest, login, logout };
};

export default useAuth;
