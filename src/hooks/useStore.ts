import { create } from "zustand";

interface Store {
  signIn: boolean;
  setSignIn: (isSignIn: boolean) => void;
}

const useStore = create<Store>((set) => ({
  signIn: false,
  setSignIn: (signIn) => set(() => ({ signIn })),
}));

export default useStore;
