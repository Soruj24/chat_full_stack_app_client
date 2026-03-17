"use client";

import { Smile, CornerUpRight, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";

interface MessageActionButtonsProps {
  message: Message;
  isMe: boolean;
  showQuickReactions: boolean;
  setShowQuickReactions: (show: boolean) => void;
  onReply: (message: Message) => void;
  onForward: (message: Message) => void;
}

export function MessageActionButtons({
  message,
  isMe,
  showQuickReactions,
  setShowQuickReactions,
  onReply,
  onForward,
}: MessageActionButtonsProps) {
  return (
    <div
      className={cn(
        "flex flex-row gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center py-1.5",
        isMe ? "items-end" : "items-start",
      )}
    >
      <button
        onClick={() => setShowQuickReactions(!showQuickReactions)}
        className={cn(
          "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200",
          showQuickReactions
            ? "text-blue-500 bg-gray-100 dark:bg-gray-800"
            : "text-gray-400",
        )}
        title="React"
      >
        <Smile className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onReply(message)}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-500 transition-all duration-200"
        title="Reply"
      >
        <CornerUpRight className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onForward(message)}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-green-500 transition-all duration-200"
        title="Forward"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
