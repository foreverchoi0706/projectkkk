import useStore from "@/app/_hooks/useStore";
import { ACCESS_TOKEN } from "@/app/_utils/constants";
import { deleteCookie, setCookie } from "@/app/_utils/cookie";

const useAuth = () => {
  const [isSignIn, setIsSignIn] = useStore(({ signIn, setSignIn }) => [
    signIn,
    setSignIn,
  ]);

  const signIn = (accessToken: string) => {
    setIsSignIn(true);
    const today = new Date();
    setCookie(ACCESS_TOKEN, accessToken, {
      expires: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
      ),
    });
    const urlSearchParams = new URLSearchParams(location.search);
    window.location.href = urlSearchParams.get("callbackUrl") ?? "/";
  };

  const signOut = () => {
    setIsSignIn(false);
    deleteCookie(ACCESS_TOKEN);
    window.location.href = "/signIn";
  };

  return {
    isSignIn,
    signIn,
    signOut,
  };
};

export default useAuth;
