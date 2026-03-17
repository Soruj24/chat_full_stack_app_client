"use client";

import { Pin, BellOff } from "lucide-react";

interface ChatListItemBadgesProps {
  isMuted?: boolean;
  isPinned?: boolean;
  unreadCount: number;
}

export function ChatListItemBadges({ isMuted, isPinned, unreadCount }: ChatListItemBadgesProps) {
  if (!isMuted && !isPinned && unreadCount <= 0) return null;

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      {isMuted && <BellOff className="w-3.5 h-3.5 text-gray-400" />}
      {isPinned && (
        <Pin className="w-3.5 h-3.5 text-blue-500 -rotate-45" />
      )}
      {unreadCount > 0 && (
        <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm shadow-blue-500/20">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
}
