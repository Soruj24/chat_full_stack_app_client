"use client";

import { IChat } from "@/lib/types";
import { ChatListItemHeader } from "./ChatListItemHeader";
import { ChatListItemMessage } from "./ChatListItemMessage";
import { ChatListItemBadges } from "./ChatListItemBadges";

interface ChatListItemContentProps {
  chat: IChat;
}

export function ChatListItemContent({ chat }: ChatListItemContentProps) {
  return (
    <div className="flex-1 min-w-0">
      <ChatListItemHeader 
        name={chat.name} 
        timestamp={chat.lastMessage?.timestamp} 
        hasUnread={chat.unreadCount > 0} 
      />

      <div className="flex justify-between items-center gap-2">
        <ChatListItemMessage chat={chat} />
        
        <ChatListItemBadges 
          isMuted={chat.isMuted} 
          isPinned={chat.isPinned} 
          unreadCount={chat.unreadCount} 
        />
      </div>
    </div>
  );
}
