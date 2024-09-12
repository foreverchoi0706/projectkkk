import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants.ts";
import { getCookie } from "@/utils/cookie.ts";
import { IStore } from "@/utils/types";
import { create } from "zustand";


const useStore = create<IStore>((set) => ({
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
