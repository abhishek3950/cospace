export interface User {
  id: string;
  name: string;
  email: string;
  position: {
    x: number;
    y: number;
  };
  status: 'online' | 'away' | 'busy' | 'offline';
  isDND: boolean;
  isInOffice: boolean;
  currentSpace: string | null;
  calendarConnected: boolean;
  currentMeeting: {
    title: string;
    isLocked: boolean;
  } | null;
  organizationId: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

export interface Space {
  id: string;
  name: string;
  type: 'desk' | 'huddle' | 'break' | 'conference' | 'meeting_room' | 'common_area';
  position: { x: number; y: number };
  width: number;
  height: number;
  occupants: string[];
  capacity: number;
}

export interface WorkspaceObject {
  id: string;
  type: 'dog' | 'plant' | 'car' | 'chair' | 'table' | 'lamp';
  position: { x: number; y: number };
  rotation: number;
  scale: number;
}

export interface ChatThread {
  id: string;
  type: 'direct' | 'group';
  name: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  encryptedKey: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'emoji' | 'gif' | 'image';
  encryptedContent: string; // Encrypted with thread key
}

export interface ChatState {
  threads: ChatThread[];
  messages: Record<string, ChatMessage[]>; // threadId -> messages
  activeThreadId: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  organizationSlug: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain: string;
  settings: {
    [key: string]: any;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  organization: Organization;
} 