import { create } from "zustand";
import { LIMIT_MESSAGE } from "../constant";

export type IMessage = {
  created_at: string;
  id: string;
  is_edit: boolean;
  sent_by: string;
  text: string;
  user: {
    avatar_url: string;
    created_at: string;
    full_name: string;
    id: string;
  } | null;
};

interface MessageState {
  messages: IMessage[];
  hasMore: boolean;
  page: number;
  selectedConversationId: string | null;
  optimisticIds: string[];
  actionMessage: IMessage | undefined;
  loading: boolean;
  setMessages: (messages: IMessage[], hasMore: boolean) => void;
  loadMoreMessages: () => void;
  setSelectedConversationId: (conversationId: string) => void;
  setLoading: (loading: boolean) => void;
  setOptimisticIds: (id: string) => void;
  addMessage: (message: IMessage) => void;
  setActionMessage: (message: IMessage | undefined) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: IMessage) => void;
}

export const useMessage = create<MessageState>((set) => ({
  messages: [],
  hasMore: true,
  page: 1,
  selectedConversationId: null,
  optimisticIds: [],
  actionMessage: undefined,
  loading: false,
  setMessages: (messages, hasMore) => {
    set((state) => ({
      messages: [...messages],
      hasMore,
      loading: false,
    }));
  },
  loadMoreMessages: () => {
    set((state) => ({
      page: state.page + 1,
      loading: true,
    }));
  },
  setSelectedConversationId: (conversationId) => {
    set((state) => ({
      selectedConversationId: conversationId,
      messages: [], // Clear messages when conversation changes
      page: 1, // Reset page number
      hasMore: true, // Reset hasMore flag
    }));
  },
  setLoading: (loading) => {
    set({ loading });
  },
  setOptimisticIds: (id) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
  addMessage: (newMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  optimisticDeleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== messageId),
    })),
  optimisticUpdateMessage: (updateMessage) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === updateMessage.id
          ? {
              ...message,
              text: updateMessage.text,
              is_edit: updateMessage.is_edit,
            }
          : message
      ),
    })),
}));
