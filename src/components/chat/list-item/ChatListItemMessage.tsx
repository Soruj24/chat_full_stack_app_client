"use client";

import { cn } from "@/lib/utils";
import { MessageStatus } from "../message/MessageStatus";
import { IChat } from "@/lib/types";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ChatListItemMessageProps {
  chat: IChat;
}

export function ChatListItemMessage({ chat }: ChatListItemMessageProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isMe = chat.lastMessage?.senderId === user?.id || chat.lastMessage?.senderId === "me";
  const hasUnread = chat.unreadCount > 0;

  return (
    <div className="flex items-center gap-1 min-w-0 flex-1">
      {isMe && chat.lastMessage?.status && !chat.isTyping && (
        <MessageStatus
          status={chat.lastMessage.status}
          className="flex-shrink-0 scale-90"
        />
      )}
      <p
        className={cn(
          "text-[13px] truncate flex-1 leading-tight",
          hasUnread
            ? "text-gray-950 dark:text-gray-50 font-semibold"
            : "text-gray-500 dark:text-gray-400",
        )}
      >
        {chat.isTyping ? (
          <span className="text-blue-500 dark:text-blue-400 italic font-medium flex items-center gap-1">
            <span className="flex gap-0.5">
              <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
            </span>
            typing...
          </span>
        ) : (
          <>
            {chat.lastMessage?.type === "image" && (
              <span className="flex items-center gap-1 text-blue-500">
                📷 Photo
              </span>
            )}
            {chat.lastMessage?.type === "voice" && (
              <span className="flex items-center gap-1 text-blue-500">
                🎤 Voice message
              </span>
            )}
            {chat.lastMessage?.type === "file" && (
              <span className="flex items-center gap-1 text-blue-500">
                📄 File
              </span>
            )}
            {chat.lastMessage?.type === "location" && (
              <span className="flex items-center gap-1 text-green-500">
                📍 Location
              </span>
            )}
            {chat.lastMessage?.type === "contact" && (
              <span className="flex items-center gap-1 text-orange-500">
                👤 Contact
              </span>
            )}
            {(!chat.lastMessage?.type ||
              chat.lastMessage?.type === "text") &&
              chat.lastMessage?.text}
          </>
        )}
      </p>
    </div>
  );
}
