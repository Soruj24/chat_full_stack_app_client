"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Star, Pin } from "lucide-react";
import { MessageStatus } from "./MessageStatus";

interface MessageInfoProps {
  message: Message;
  isMe: boolean;
}

export function MessageInfo({ message, isMe }: MessageInfoProps) {
  return (
    <div
      className={cn(
        "px-2.5 pb-1 flex justify-end items-center gap-1.5 leading-none select-none",
        isMe ? "text-white/60" : "text-gray-400 dark:text-gray-500"
      )}
    >
      <div className="flex items-center gap-1">
        {message.isStarred && (
          <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
        )}
        {message.isPinned && (
          <Pin className={cn("w-2.5 h-2.5 rotate-45", isMe ? "text-white/70" : "text-blue-500")} />
        )}
      </div>
      <span className="text-[10px] font-medium tracking-tight">
        {message.timestamp}
      </span>
      {isMe && (
        <div className="flex items-center ml-0.5">
          <MessageStatus status={message.status || 'sent'} />
        </div>
      )}
    </div>
  );
}
