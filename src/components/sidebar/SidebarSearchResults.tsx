"use client";

import { ChatListItem } from "../chat/ChatListItem";
import { UserSearchResult } from "./UserSearchResult";
import { MessageSearchResult } from "./MessageSearchResult";
import { SearchEmptyState } from "./SearchEmptyState";
import { IChat, Message, User } from "@/lib/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SidebarSearchResultsProps {
  results: {
    chats: IChat[];
    messages: { chatId: string; message: Message }[];
    users: User[];
  };
  activeId?: string | null;
}

export function SidebarSearchResults({ results, activeId }: SidebarSearchResultsProps) {
  const { chats } = useSelector((state: RootState) => state.chat);
  const hasResults = results.chats.length > 0 || results.messages.length > 0 || results.users.length > 0;

  if (!hasResults) {
    return <SearchEmptyState />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* 1. Chats Section */}
      {results.chats.length > 0 && (
        <div className="mb-4" key="search-chats">
          <SectionHeader title="Conversations" />
          {results.chats.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} isActive={activeId === chat.id} />
          ))}
        </div>
      )}

      {/* 2. Global Users Section */}
      {results.users.length > 0 && (
        <div className="mb-4" key="search-users">
          <SectionHeader title="Global Users" />
          {results.users.map((user) => (
            <UserSearchResult key={user.id} user={user} />
          ))}
        </div>
      )}

      {/* 3. Global Messages Section */}
      {results.messages.length > 0 && (
        <div className="mb-4" key="search-messages">
          <SectionHeader title="Messages" />
          {results.messages.map(({ chatId, message }, idx) => (
            <MessageSearchResult 
              key={`${chatId}-${message.id || idx}-${idx}`}
              chatId={chatId}
              message={message}
              chatName={chats.find(c => c.id === chatId)?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-4 py-3 text-[11px] font-black text-blue-600 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800/50 mb-1">
      {title}
    </div>
  );
}
