import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants.ts";
import { getCookie } from "@/utils/cookie.ts";
import { IToken, TRole } from "@/utils/types.ts";
import { create } from "zustand";

interface Store {
  token: IToken;
  setToken: (token: IToken) => void;
  role: TRole | null;
  setRole: (role: TRole | null) => void;
  signIn: boolean;
  setSignIn: (isSignIn: boolean) => void;
}

const useStore = create<Store>((set) => ({
  token: {
    accessToken: getCookie(ACCESS_TOKEN) || "",
    refreshToken: getCookie(REFRESH_TOKEN) || "",
  },
  setToken: (token) => set(() => ({ token })),
  role: null,
  setRole: (role) => set(() => ({ role })),
  signIn: false,
  setSignIn: (signIn) => set(() => ({ signIn })),
}));

export default useStore;
