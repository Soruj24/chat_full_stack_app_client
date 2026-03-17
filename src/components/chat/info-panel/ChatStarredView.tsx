"use client";

import { ArrowLeft, Star } from "lucide-react";
import { Message, IChat } from "@/lib/types";

interface ChatStarredViewProps {
  starredMessages?: Message[];
  chat: IChat;
  onBack: () => void;
  onMessageClick?: (messageId: string) => void;
}

export function ChatStarredView({ starredMessages, chat, onBack, onMessageClick }: ChatStarredViewProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Starred Messages Header */}
      <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">Starred</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase">{starredMessages?.length || 0} Messages</p>
        </div>
      </div>

      {/* Starred Messages List */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-4">
        {starredMessages && starredMessages.length > 0 ? (
          starredMessages.map((msg) => (
            <div 
              key={msg.id} 
              onClick={() => onMessageClick?.(msg.id)}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                  {msg.isMe ? "You" : chat.name}
                </span>
                <span className="text-[10px] text-gray-400 font-medium group-hover:text-blue-500 transition-colors">{msg.timestamp}</span>
              </div>
              <p className="text-[13px] text-gray-700 dark:text-gray-300 line-clamp-3">
                {msg.text || (msg.type === 'image' ? '📷 Photo' : msg.type === 'voice' ? '🎤 Voice' : '📄 File')}
              </p>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-40">
            <Star className="w-12 h-12 mb-4" />
            <p className="text-sm font-medium">No starred messages yet</p>
            <p className="text-xs mt-1">Star important messages to find them easily later</p>
          </div>
        )}
      </div>
    </div>
  );
}
