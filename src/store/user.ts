
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';

type LocalUser = { id: string; username: string; pinHash: string };

type UsersState = {
  users: LocalUser[];
  addUser: (username: string, pinHash: string) => LocalUser;
  findByUsername: (username: string) => LocalUser | undefined;
};

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [],
      addUser: (username, pinHash) => {
        const user = { id: uuidv4(), username, pinHash };
        set((s) => ({ users: [...s.users, user] }));
        return user;
      },
      findByUsername: (username) =>
        get().users.find((u) => u.username.toLowerCase() === username.toLowerCase()),
    }),
    { name: "notes-users-storage" ,
      storage: createJSONStorage (()=> AsyncStorage),
    }
  )
);
