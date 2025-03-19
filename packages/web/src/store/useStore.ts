import create from 'zustand';
import type { User, Space, WorkspaceObject, ChatThread, ChatMessage, ChatState } from '@cospace/shared';

// Define the global store interface that manages application state
interface Store {
  // User state
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User) => void;
  setUserPosition: (userId: string, position: { x: number; y: number }) => void;
  setUserDND: (userId: string, isDND: boolean) => void;
  setUserAudioEnabled: (userId: string, enabled: boolean) => void;
  setUserVideoEnabled: (userId: string, enabled: boolean) => void;

  // Space state
  spaces: Space[];
  setSpaces: (spaces: Space[]) => void;

  // Workspace objects state
  workspaceObjects: WorkspaceObject[];
  addWorkspaceObject: (object: WorkspaceObject) => void;
  removeWorkspaceObject: (objectId: string) => void;

  // Chat state
  chatState: ChatState;
  setActiveThread: (threadId: string | null) => void;
  sendMessage: (message: Omit<ChatMessage, 'id' | 'encryptedContent'>) => void;
  createDirectMessageThread: (userId: string) => string;
}

// Create the global store using Zustand
export const useStore = create<Store>((set) => ({
  // Initial user state
  currentUser: {
    id: 'current-user',
    name: 'You',
    email: 'you@example.com',
    position: { x: 15, y: 15 },
    status: 'online',
    isDND: false,
    isInOffice: true,
    currentSpace: null,
    calendarConnected: false,
    currentMeeting: null,
    organizationId: 'org1',
    isAudioEnabled: false,
    isVideoEnabled: false,
  },
  users: [
    {
      id: 'user1',
      name: 'Alice',
      email: 'alice@example.com',
      position: { x: 30, y: 30 },
      status: 'online',
      isDND: false,
      isInOffice: true,
      currentSpace: null,
      calendarConnected: false,
      currentMeeting: null,
      organizationId: 'org1',
      isAudioEnabled: false,
      isVideoEnabled: false,
    },
    {
      id: 'user2',
      name: 'Bob',
      email: 'bob@example.com',
      position: { x: 70, y: 70 },
      status: 'online',
      isDND: false,
      isInOffice: true,
      currentSpace: null,
      calendarConnected: false,
      currentMeeting: null,
      organizationId: 'org1',
      isAudioEnabled: false,
      isVideoEnabled: false,
    },
    {
      id: 'user3',
      name: 'Charlie',
      email: 'charlie@example.com',
      position: { x: 45, y: 25 },
      status: 'online',
      isDND: false,
      isInOffice: true,
      currentSpace: null,
      calendarConnected: false,
      currentMeeting: null,
      organizationId: 'org1',
      isAudioEnabled: false,
      isVideoEnabled: false,
    },
    {
      id: 'user4',
      name: 'Diana',
      email: 'diana@example.com',
      position: { x: 55, y: 45 },
      status: 'busy',
      isDND: false,
      isInOffice: true,
      currentSpace: null,
      calendarConnected: false,
      currentMeeting: null,
      organizationId: 'org1',
      isAudioEnabled: false,
      isVideoEnabled: false,
    },
    {
      id: 'user5',
      name: 'Eve',
      email: 'eve@example.com',
      position: { x: 85, y: 35 },
      status: 'away',
      isDND: false,
      isInOffice: true,
      currentSpace: null,
      calendarConnected: false,
      currentMeeting: null,
      organizationId: 'org1',
      isAudioEnabled: false,
      isVideoEnabled: false,
    },
  ],

  // Initial space state
  spaces: [
    {
      id: 'all-hands',
      name: 'All Hands Room',
      type: 'meeting_room',
      position: { x: 10, y: 10 },
      width: 30,
      height: 20,
      occupants: [],
      capacity: 30,
    },
    {
      id: 'meeting-room-1',
      name: 'Meeting Room 1',
      type: 'meeting_room',
      position: { x: 50, y: 10 },
      width: 15,
      height: 12,
      occupants: [],
      capacity: 8,
    },
    {
      id: 'huddle-1',
      name: 'Huddle Space',
      type: 'huddle',
      position: { x: 75, y: 10 },
      width: 12,
      height: 10,
      occupants: [],
      capacity: 4,
    },
    {
      id: 'desk-1',
      name: 'Desk 1',
      type: 'desk',
      position: { x: 15, y: 40 },
      width: 8,
      height: 6,
      occupants: [],
      capacity: 1,
    },
    {
      id: 'desk-2',
      name: 'Desk 2',
      type: 'desk',
      position: { x: 30, y: 40 },
      width: 8,
      height: 6,
      occupants: [],
      capacity: 1,
    },
    {
      id: 'desk-3',
      name: 'Desk 3',
      type: 'desk',
      position: { x: 45, y: 40 },
      width: 8,
      height: 6,
      occupants: [],
      capacity: 1,
    },
    {
      id: 'desk-4',
      name: 'Desk 4',
      type: 'desk',
      position: { x: 15, y: 55 },
      width: 8,
      height: 6,
      occupants: [],
      capacity: 1,
    },
    {
      id: 'desk-5',
      name: 'Desk 5',
      type: 'desk',
      position: { x: 30, y: 55 },
      width: 8,
      height: 6,
      occupants: [],
      capacity: 1,
    },
    {
      id: 'desk-6',
      name: 'Desk 6',
      type: 'desk',
      position: { x: 45, y: 55 },
      width: 8,
      height: 6,
      occupants: [],
      capacity: 1,
    },
  ],

  // Initial workspace objects state
  workspaceObjects: [],

  // Initial chat state
  chatState: {
    threads: [
      {
        id: 'general',
        type: 'group',
        name: 'General',
        participants: [],
        unreadCount: 0,
        encryptedKey: '',
      },
    ],
    messages: {
      general: [],
    },
    activeThreadId: null,
  },

  // User actions
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setUserPosition: (userId, position) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, position } : u
      ),
      currentUser:
        state.currentUser?.id === userId
          ? { ...state.currentUser, position }
          : state.currentUser,
    })),

  setUserDND: (userId, isDND) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, isDND } : u
      ),
      currentUser:
        state.currentUser?.id === userId
          ? { ...state.currentUser, isDND }
          : state.currentUser,
    })),

  setUserAudioEnabled: (userId, enabled) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, isAudioEnabled: enabled } : u
      ),
      currentUser:
        state.currentUser?.id === userId
          ? { ...state.currentUser, isAudioEnabled: enabled }
          : state.currentUser,
    })),

  setUserVideoEnabled: (userId, enabled) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, isVideoEnabled: enabled } : u
      ),
      currentUser:
        state.currentUser?.id === userId
          ? { ...state.currentUser, isVideoEnabled: enabled }
          : state.currentUser,
    })),

  // Space actions
  setSpaces: (spaces) => set({ spaces }),

  // Workspace object actions
  addWorkspaceObject: (object) =>
    set((state) => ({
      workspaceObjects: [...state.workspaceObjects, object],
    })),

  removeWorkspaceObject: (objectId) =>
    set((state) => ({
      workspaceObjects: state.workspaceObjects.filter((obj) => obj.id !== objectId),
    })),

  // Chat actions
  setActiveThread: (threadId) =>
    set((state) => ({
      chatState: {
        ...state.chatState,
        activeThreadId: threadId,
      },
    })),

  sendMessage: (message) =>
    set((state) => ({
      chatState: {
        ...state.chatState,
        messages: {
          ...state.chatState.messages,
          [message.threadId]: [
            ...(state.chatState.messages[message.threadId] || []),
            {
              ...message,
              id: `msg-${Date.now()}`,
              encryptedContent: message.content, // In a real app, this would be encrypted
            },
          ],
        },
      },
    })),

  createDirectMessageThread: (userId: string): string => {
    const state = useStore.getState();
    const otherUser = state.users.find((u: User) => u.id === userId);
    if (!otherUser || !state.currentUser) return '';

    const threadId = `dm-${state.currentUser.id}-${userId}`;
    const existingThread = state.chatState.threads.find((t: ChatThread) => t.id === threadId);
    
    if (existingThread) return threadId;

    const newThread: ChatThread = {
      id: threadId,
      type: 'direct',
      name: otherUser.name,
      participants: [state.currentUser.id, userId],
      unreadCount: 0,
      encryptedKey: '', // In a real app, this would be a proper encryption key
    };

    set((state: Store) => ({
      chatState: {
        ...state.chatState,
        threads: [...state.chatState.threads, newThread],
        messages: {
          ...state.chatState.messages,
          [threadId]: [],
        },
      },
    }));

    return threadId;
  },
})); 