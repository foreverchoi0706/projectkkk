import { create } from "zustand";

interface Store {
  setSignIn: (isSignIn: boolean) => void;
  signIn: boolean;
}

const useStore = create<Store>((set) => ({
  setSignIn: (signIn) => set(() => ({ signIn })),
  signIn: false,
}));

export default useStore;
