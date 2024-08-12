import { create } from "zustand";

type UseAuthStore = {
  auth: boolean;
  setAuth: (isAuth: boolean) => void;
};

export const useAuthStore = create<UseAuthStore>((set) => ({
  auth: new Date(localStorage["RefreshTokenExpires"]) > new Date(),
  setAuth: (isAuth: boolean) => set(() => ({ auth: isAuth })),
}));
