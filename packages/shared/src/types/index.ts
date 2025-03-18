export interface Position {
  x: number;
  y: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain: string;
  settings: {
    theme: {
      primaryColor: string;
      logo: string;
    };
    features: {
      maxUsers: number;
      allowedRooms: ('meeting' | 'common' | 'private')[];
    };
  };
}

export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  position: Position;
  status: UserStatus;
  isInOffice: boolean;
  isDND: boolean;
  calendarConnected: boolean;
  currentSpace: string | null;
  currentMeeting: {
    id: string;
    title: string;
    endTime: string;
  } | null;
}

export type MessageType = 'text' | 'image' | 'file';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string | null;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isPrivate: boolean;
}

export type SpaceType = 'desk' | 'meeting_room' | 'common_area';

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  position: Position;
  width: number;
  height: number;
  capacity: number;
  occupants: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  organizationSlug: string;
}

export interface AuthResponse {
  user: User;
  organization: Organization;
  token: string;
}

export interface ChatThread {
  id: string;
  participants: string[];
  messages: ChatMessage[];
  lastActivity: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'mention' | 'meeting' | 'system';
  content: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  meetingLink?: string;
  organizationId: string;
} 