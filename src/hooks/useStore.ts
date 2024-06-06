import { create } from "zustand";
import { hasCookie } from "@/utils/cookie.ts";
import { ADMIN_ACCESS_TOKEN } from "@/utils/constants.ts";

interface Store {
  signIn: boolean;
  setSignIn: (isSignIn: boolean) => void;
}

const useStore = create<Store>((set) => ({
  signIn: hasCookie(ADMIN_ACCESS_TOKEN),
  setSignIn: (signIn) => set(() => ({ signIn })),
}));

export default useStore;
