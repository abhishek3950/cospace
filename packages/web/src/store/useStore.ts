import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  avatar: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

interface AppState {
  // UI State
  hoveredDesk: boolean;
  setHoveredDesk: (hovered: boolean) => void;

  // User State
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Room State
  currentRoom: string | null;
  setCurrentRoom: (room: string | null) => void;

  // Chat State
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessages: Array<{
    id: string;
    userId: string;
    message: string;
    timestamp: number;
  }>;
  addChatMessage: (message: {
    id: string;
    userId: string;
    message: string;
    timestamp: number;
  }) => void;

  // Audio/Video State
  isAudioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  isVideoEnabled: boolean;
  setVideoEnabled: (enabled: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // UI State
  hoveredDesk: false,
  setHoveredDesk: (hovered) => set({ hoveredDesk: hovered }),

  // User State
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  // Room State
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),

  // Chat State
  isChatOpen: false,
  setChatOpen: (open) => set({ isChatOpen: open }),
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  // Audio/Video State
  isAudioEnabled: false,
  setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
  isVideoEnabled: false,
  setVideoEnabled: (enabled) => set({ isVideoEnabled: enabled }),
})); 