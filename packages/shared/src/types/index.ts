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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  organizationId: string;
  role: 'admin' | 'member';
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: number;
  organizationId: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'meeting' | 'common' | 'private';
  position: [number, number, number];
  rotation: [number, number, number];
  isLocked: boolean;
  participants: string[];
  organizationId: string;
}

export interface Desk {
  id: string;
  userId: string | null;
  position: [number, number, number];
  rotation: [number, number, number];
  isOccupied: boolean;
  organizationId: string;
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