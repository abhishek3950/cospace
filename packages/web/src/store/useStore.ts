import { create } from 'zustand';
import { User, Space, Position } from '@cospace/shared';

interface AppState {
  currentUser: User | null;
  users: User[];
  spaces: Space[];
  currentRoom: string | null;
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  setUserPosition: (userId: string, position: Position) => void;
  setIsInOffice: (userId: string | undefined, isInOffice: boolean) => void;
  setIsDND: (userId: string | undefined, isDND: boolean) => void;
  setCurrentSpace: (userId: string | undefined, spaceId: string | null) => void;
  setCalendarConnected: (connected: boolean) => void;
  setCurrentMeeting: (meeting: { id: string; title: string; endTime: string } | null) => void;
  setCurrentRoom: (roomId: string | null) => void;
  addSpace: (space: Space) => void;
}

const updateUser = (user: User, updates: Partial<User>): User => ({
  ...user,
  ...updates,
});

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  users: [],
  spaces: [],
  currentRoom: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  setUsers: (users) => set({ users }),
  setCurrentRoom: (roomId) => set({ currentRoom: roomId }),
  addSpace: (space) => set((state) => ({ spaces: [...state.spaces, space] })),
  setUserPosition: (userId, position) =>
    set((state) => {
      if (!userId) return state;
      return {
        users: state.users.map((user) =>
          user.id === userId ? updateUser(user, { position }) : user
        ),
        currentUser:
          state.currentUser?.id === userId
            ? updateUser(state.currentUser, { position })
            : state.currentUser,
      };
    }),
  setIsInOffice: (userId, isInOffice) =>
    set((state) => {
      if (!userId) return state;
      return {
        users: state.users.map((user) =>
          user.id === userId ? updateUser(user, { isInOffice }) : user
        ),
        currentUser:
          state.currentUser?.id === userId
            ? updateUser(state.currentUser, { isInOffice })
            : state.currentUser,
      };
    }),
  setIsDND: (userId, isDND) =>
    set((state) => {
      if (!userId) return state;
      return {
        users: state.users.map((user) =>
          user.id === userId ? updateUser(user, { isDND }) : user
        ),
        currentUser:
          state.currentUser?.id === userId
            ? updateUser(state.currentUser, { isDND })
            : state.currentUser,
      };
    }),
  setCurrentSpace: (userId, spaceId) =>
    set((state) => {
      if (!userId) return state;
      return {
        users: state.users.map((user) =>
          user.id === userId ? updateUser(user, { currentSpace: spaceId }) : user
        ),
        currentUser:
          state.currentUser?.id === userId
            ? updateUser(state.currentUser, { currentSpace: spaceId })
            : state.currentUser,
      };
    }),
  setCalendarConnected: (connected) =>
    set((state) => {
      if (!state.currentUser) return state;
      const updatedUser = updateUser(state.currentUser, { calendarConnected: connected });
      return {
        currentUser: updatedUser,
        users: state.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        ),
      };
    }),
  setCurrentMeeting: (meeting) =>
    set((state) => {
      if (!state.currentUser) return state;
      const updatedUser = updateUser(state.currentUser, { currentMeeting: meeting });
      return {
        currentUser: updatedUser,
        users: state.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        ),
      };
    }),
})); 