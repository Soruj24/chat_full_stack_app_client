export type UserStatus = "online" | "offline" | "typing" | "last seen recently";

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  avatar: string;
  status: UserStatus;
  phoneNumber?: string;
  username?: string;
  bio?: string;
  lastSeen?: string;
  settings?: UserSettings;
  starredMessages?: string[];
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  accentColor: string;
  bubbleStyle: "modern" | "classic" | "rounded";
  showNotifications: boolean;
  messagePreview: boolean;
  soundEffects: boolean;
  readReceipts: boolean;
  lastSeenVisibility: "everyone" | "contacts" | "nobody";
  twoFactorAuth: boolean;
  notificationSound: string;
}

export type MessageType = "text" | "image" | "video" | "file" | "voice" | "location" | "contact";

export interface Message {
  id: string;
  _id?: string;
  sender?: string | { _id?: string; id?: string };
  senderId: string;
  senderName?: string; // For group chats
  senderAvatar?: string; // Added for profile pictures
  text?: string;
  timestamp: string;
  date: string;
  status: "sent" | "delivered" | "read" | "sending" | "error";
  isMe: boolean;
  type: MessageType;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  duration?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  contact?: {
    name: string;
    phoneNumber: string;
    avatar?: string;
  };
  replyTo?: {
    id: string;
    text?: string;
    senderName: string;
  };
  isForwarded?: boolean;
  isStarred?: boolean;
  isPinned?: boolean;
  reactions?: {
    emoji: string;
    count: number;
    me: boolean;
  }[];
}

export interface IChat {
  id: string;
  type: "individual" | "group" | "private"; // Added private
  otherParticipantId?: string; // Added this
  name: string;
  avatar: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    senderId: string;
    status?: "sent" | "delivered" | "read" | "sending" | "error";
    type?: MessageType;
  };
  unreadCount: number;
  members?: User[];
  description?: string;
  isMuted?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  status?: UserStatus;
  isTyping?: boolean; // Added this
  wallpaper?: string;
  themeColor?: string;
  pinnedMessageIds?: string[];
}
