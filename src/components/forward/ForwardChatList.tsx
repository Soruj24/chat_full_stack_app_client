"use client";

import { IChat } from "@/lib/types";
import { ForwardChatItem } from "./ForwardChatItem";

interface ForwardChatListProps {
  chats: IChat[];
  selectedChatIds: Set<string>;
  onToggleChat: (chatId: string) => void;
}

export function ForwardChatList({
  chats,
  selectedChatIds,
  onToggleChat,
}: ForwardChatListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {chats.map((chat) => (
        <ForwardChatItem 
          key={chat.id} 
          chat={chat} 
          isSelected={selectedChatIds.has(chat.id)} 
          onToggle={() => onToggleChat(chat.id)} 
        />
      ))}
    </div>
  );
}
