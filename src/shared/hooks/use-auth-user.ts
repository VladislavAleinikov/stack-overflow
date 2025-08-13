import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

type AuthUserStore = {
  authUser: User | null;
  setAuthUser: (user: User) => void;
  removeAuthUser: () => void;
};

export const useAuthUser = create<AuthUserStore>()(
  persist(
    (set) => ({
      authUser: null,
      setAuthUser: (user) => set({ authUser: user }),
      removeAuthUser: () => set({ authUser: null }),
    }),
    {
      name: "auth-user",
    }
  )
);
