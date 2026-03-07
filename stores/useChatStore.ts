import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatStore {
  messages: ChatMessage[];
  animatingId: string | null;
  addMessage: (message: ChatMessage) => void;
  setAnimatingId: (id: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [
        {
          id: '1',
          text: 'Hello! I am your handbag shopping assistant. What kind of bag are you looking for?',
          isBot: true,
          timestamp: new Date(),
        },
      ],
      animatingId: null,
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      setAnimatingId: (id) => set({ animatingId: id }),
      clearMessages: () =>
        set({
          messages: [
            {
              id: '1',
              text: 'Hello! I am your handbag shopping assistant. What kind of bag are you looking for?',
              isBot: true,
              timestamp: new Date(),
            },
          ],
        }),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
