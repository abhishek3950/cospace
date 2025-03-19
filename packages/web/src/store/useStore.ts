import { create } from 'zustand';
import type { User, Space, ChatThread, ChatMessage, WorkspaceObject } from '@cospace/shared';

// Define the global store interface that manages application state
interface Store {
  // User-related state
  currentUser: User | null;  // Currently logged-in user
  users: User[];            // All users in the workspace
  spaces: Space[];          // All available spaces (desks, rooms, etc.)
  workspaceObjects: WorkspaceObject[];  // Decorative objects in the workspace

  // Chat-related state
  chatState: {
    threads: ChatThread[];                    // All chat threads
    messages: Record<string, ChatMessage[]>;  // Messages organized by thread ID
    activeThreadId: string | null;            // Currently selected chat thread
  };

  // User actions and state updates
  setCurrentUser: (user: User | null) => void;
  setUserPosition: (userId: string, position: { x: number; y: number }) => void;
  setCurrentSpace: (userId: string, spaceId: string | null) => void;
  setCurrentRoom: (roomId: string | null) => void;

  // Workspace object management
  addWorkspaceObject: (object: Omit<WorkspaceObject, 'id'>) => void;
  updateWorkspaceObject: (id: string, updates: Partial<WorkspaceObject>) => void;
  deleteWorkspaceObject: (id: string) => void;

  // Chat management
  setActiveThread: (threadId: string | null) => void;

  // Calendar integration
  setCalendarConnected: (connected: boolean) => void;
  setCurrentMeeting: (meeting: { id: string; title: string; endTime: string } | null) => void;
}

// Create the global store using Zustand
export const useStore = create<Store>((set) => ({
  // Initial state
  currentUser: null,
  users: [],
  spaces: [],
  workspaceObjects: [],
  chatState: {
    threads: [],
    messages: {},
    activeThreadId: null,
  },

  // User management actions
  setCurrentUser: (user) => set({ currentUser: user }),

  // Update a user's position in the workspace
  setUserPosition: (userId, position) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, position } : user
      ),
    })),

  // Update a user's current space (desk, room, etc.)
  setCurrentSpace: (userId, spaceId) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, currentSpace: spaceId } : user
      ),
    })),

  // Update the current user's room
  setCurrentRoom: (roomId) =>
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, currentRoom: roomId }
        : null,
    })),

  // Workspace object management actions
  addWorkspaceObject: (object) =>
    set((state) => ({
      workspaceObjects: [
        ...state.workspaceObjects,
        { ...object, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),

  updateWorkspaceObject: (id, updates) =>
    set((state) => ({
      workspaceObjects: state.workspaceObjects.map((obj) =>
        obj.id === id ? { ...obj, ...updates } : obj
      ),
    })),

  deleteWorkspaceObject: (id) =>
    set((state) => ({
      workspaceObjects: state.workspaceObjects.filter((obj) => obj.id !== id),
    })),

  // Chat management actions
  setActiveThread: (threadId) =>
    set((state) => ({
      chatState: { ...state.chatState, activeThreadId: threadId },
    })),

  // Calendar integration actions
  setCalendarConnected: (connected) =>
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, calendarConnected: connected }
        : null,
    })),

  setCurrentMeeting: (meeting) =>
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, currentMeeting: meeting }
        : null,
    })),
})); 