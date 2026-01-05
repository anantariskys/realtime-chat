export type ChatType = 'personal' | 'group';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isOwn: boolean;
  type: 'message' | 'system';
}

export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  isOnline?: boolean;
  members?: User[];
  adminIds?: string[];
}
