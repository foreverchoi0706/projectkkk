import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
import { deleteCookie, getCookie, hasCookie, setCookie } from "@/utils/cookie";
import queryKeys from "@/utils/queryKeys";
import { IUserInfo } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useAuth = () => {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery({
    ...queryKeys.auth.verify({
      accessToken: getCookie(ACCESS_TOKEN)!,
      refreshToken: getCookie(REFRESH_TOKEN)!,
    }),
    enabled: hasCookie(ACCESS_TOKEN) && hasCookie(REFRESH_TOKEN),
  });

  const login = ({ accessToken, refreshToken }: IUserInfo) => {
    setCookie(ACCESS_TOKEN, accessToken);
    setCookie(REFRESH_TOKEN, refreshToken);
    queryClient.invalidateQueries();
  };

  const logout = () => {
    alert("로그아웃되었습니다");
    deleteCookie(ACCESS_TOKEN);
    deleteCookie(REFRESH_TOKEN);
    queryClient.setQueryData<null>(
      queryKeys.auth.verify({
        accessToken: getCookie(ACCESS_TOKEN)!,
        refreshToken: getCookie(REFRESH_TOKEN)!,
      }).queryKey,
      null,
    );
  };

  return { auth: data, ...rest, login, logout };
};

export default useAuth;
