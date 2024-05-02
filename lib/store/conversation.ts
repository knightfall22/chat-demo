import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { LIMIT_MESSAGE } from "../constant";

export const useConversation = create()((set) => ({
  conversation: [],
  setConversation: (singleConversation: any) =>
    set((state: any) => ({
      conversation: [...singleConversation],
    })),
}));
