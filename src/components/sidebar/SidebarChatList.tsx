"use client";

import { ChatListItem } from "../chat/ChatListItem";
import { ChatListSkeleton } from "./ChatListSkeleton";
import { UserSearchResult } from "./UserSearchResult";
import { Ghost, Users } from "lucide-react";

import { IChat, User } from "@/lib/types";

interface SidebarChatListProps {
  pinnedChats: IChat[];
  otherChats: IChat[];
  allUsers?: User[];
  activeId?: string | null;
  loading?: boolean;
  onPin: (id: string) => void;
  onMute: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SidebarChatList({ 
  pinnedChats, 
  otherChats, 
  allUsers = [],
  activeId,
  loading = false,
  onPin,
  onMute,
  onArchive,
  onDelete
}: SidebarChatListProps) {
  const hasChats = pinnedChats.length > 0 || otherChats.length > 0;
  const hasUsers = allUsers.length > 0;

  if (loading) {
    // show skeleton while chats are loading
    return <ChatListSkeleton />;
  }

  if (!hasChats && !hasUsers) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <Ghost className="w-10 h-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">No chats found</h3>
        <p className="text-sm text-gray-500">Try changing your filters or start a new conversation</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-50 dark:divide-gray-800/30">
      {pinnedChats.length > 0 && (
        <div className="pb-2">
          <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Pinned
          </div>
          {pinnedChats.map((chat) => (
            <ChatListItem 
              key={`pinned-${chat.id}`} 
              chat={chat} 
              isActive={activeId === chat.id}
              onPin={onPin}
              onMute={onMute}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <div>
        {pinnedChats.length > 0 && otherChats.length > 0 && (
          <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            All Messages
          </div>
        )}
        {otherChats.map((chat) => (
          <ChatListItem 
            key={`other-${chat.id}`} 
            chat={chat} 
            isActive={activeId === chat.id}
            onPin={onPin}
            onMute={onMute}
            onArchive={onArchive}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* All Users Section */}
      {allUsers.length > 0 && (
        <div className="pt-2">
          <div className="px-4 py-2 text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-3 h-3" />
            All Users
          </div>
          {allUsers.map((user) => (
            <UserSearchResult key={`user-${user.id}`} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
