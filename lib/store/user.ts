import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserState {
  user: User | undefined;
  usersList: User[];
  setUsersList: (list: User[]) => void;
}

export const useUser = create<UserState>()((set) => ({
  user: undefined,
  usersList: [],
  setUsersList: (list) => {
    set((state) => ({
      usersList: [...list],
    }));
  },
}));
