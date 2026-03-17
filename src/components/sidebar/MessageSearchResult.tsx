"use client";

import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Message } from "@/lib/types";

interface MessageSearchResultProps {
  chatId: string;
  message: Message;
  chatName?: string;
}

export function MessageSearchResult({ chatId, message, chatName }: MessageSearchResultProps) {
  const router = useRouter();

  return (
    <div 
      onClick={() => {
        if (chatId) {
          router.push(`/chat/${chatId}?msgId=${message.id}`);
        } else {
          console.warn("Attempted to navigate to chat with undefined id from search result", message);
        }
      }}
      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-800/10"
    >
      <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <MessageSquare className="w-4 h-4 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            In {chatName || 'Conversation'}
          </span>
          <span className="text-[10px] text-gray-400">{message.timestamp}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
          {message.text}
        </p>
      </div>
    </div>
  );
}
