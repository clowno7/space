import { create } from 'zustand';
import { User, ChatMessage } from '../types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  chatMessages: ChatMessage[];
  setUser: (user: User | null) => void;
  addChatMessage: (message: ChatMessage) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  chatMessages: [],
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
}));