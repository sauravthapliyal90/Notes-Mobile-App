import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  id: string;
  username: string;
};

type AuthState = {
  user: User | null;
  setUser: (u: User | null) => void;
  loginLocal: (user: User) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (u: User | null) => set({ user: u }),

      // For local-only auth (signup/login), call loginLocal after verifying credentials
      loginLocal: async (user) => {
        // you can add extra logic here (e.g. update lastLogin timestamp)
        set({ user });
      },

      logout: async () => {
        set({ user: null });
      },
    }),
    {
      name: "notes-auth-storage", // key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
