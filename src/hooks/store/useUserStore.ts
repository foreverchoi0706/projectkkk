import { create } from "zustand";

interface UserStore {
  signIn: boolean;
  setSignIn: (isSignIn: boolean) => void;
}

const useUserStore = create<UserStore>((set) => ({
  signIn: true,
  setSignIn: (signIn) => set(() => ({ signIn })),
}));

export default useUserStore;
