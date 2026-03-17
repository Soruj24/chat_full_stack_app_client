"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { IChat, Message } from "@/lib/types";
import { ChatInfoProfile } from "./ChatInfoProfile";
import { ChatInfoMediaPreview } from "./ChatInfoMediaPreview";
import { ChatInfoActions } from "./ChatInfoActions";
import { ChatInfoDescription } from "./ChatInfoDescription";
import { ChatInfoMembers } from "./ChatInfoMembers";

interface ChatInfoMainViewProps {
  chat: IChat;
  onClose: () => void;
  setViewMode: (
    mode: "info" | "media" | "wallpaper" | "starred" | "search" | "theme",
  ) => void;
  starredMessages?: Message[];
  allMedia: { id: number; url: string }[];
}

export function ChatInfoMainView({
  chat,
  onClose,
  setViewMode,
  starredMessages,
  allMedia,
}: ChatInfoMainViewProps) {
  const isGroup = chat.type === "group";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Info
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <ChatInfoProfile
          chat={chat}
          isGroup={isGroup}
          onSearchClick={() => setViewMode("search")}
        />

        <ChatInfoDescription description={chat.description} isGroup={isGroup} />

        <ChatInfoMediaPreview
          allMedia={allMedia}
          onViewAll={() => setViewMode("media")}
        />

        {isGroup && chat.members && <ChatInfoMembers members={chat.members} />}

        <ChatInfoActions
          isGroup={isGroup}
          starredMessagesCount={starredMessages?.length || 0}
          setViewMode={setViewMode}
        />
      </div>
    </div>
  );
}
