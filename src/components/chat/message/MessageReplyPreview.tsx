"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MessageReplyPreviewProps {
  replyTo: NonNullable<Message["replyTo"]>;
  isMe: boolean;
  themeColor?: string;
}

export function MessageReplyPreview({ replyTo, isMe, themeColor }: MessageReplyPreviewProps) {
  return (
    <div 
      className={cn(
        "mx-2 mt-2 p-2 rounded-lg border-l-4 text-xs bg-black/5 dark:bg-white/5",
        isMe ? "border-blue-200" : "border-blue-500"
      )}
      style={!isMe && themeColor ? { borderLeftColor: themeColor } : {}}
    >
      <p 
        className="font-bold mb-0.5"
        style={!isMe && themeColor ? { color: themeColor } : {}}
      >
        {replyTo.senderName}
      </p>
      <p className="opacity-70 truncate">{replyTo.text}</p>
    </div>
  );
}
