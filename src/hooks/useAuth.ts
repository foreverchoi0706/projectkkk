import useStore from "@/hooks/useStore.ts";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants.ts";
import { deleteCookie, setCookie } from "@/utils/cookie.ts";
import { IUserInfo } from "@/utils/types.ts";

const useAuth = () => {
  const store = useStore((store) => store);

  const login = ({ role, accessToken, refreshToken }: IUserInfo) => {
    setCookie(ACCESS_TOKEN, accessToken);
    setCookie(REFRESH_TOKEN, refreshToken);
    store.setRole(role);
    store.setSignIn(true);
  };

  const logout = () => {
    deleteCookie(ACCESS_TOKEN);
    deleteCookie(REFRESH_TOKEN);
    store.setRole(null);
    store.setSignIn(false);
  };

  return { ...store, login, logout };
};

export default useAuth;
