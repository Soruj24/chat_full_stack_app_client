"use client";

import { ArrowLeft, Search, X } from "lucide-react";
import { Message, IChat } from "@/lib/types";
import { useState, useMemo } from "react";

interface ChatSearchViewProps {
  messages: Message[];
  chat: IChat;
  onBack: () => void;
  onMessageClick?: (messageId: string) => void;
}

export function ChatSearchView({ messages, chat, onBack, onMessageClick }: ChatSearchViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return messages.filter(msg => 
      msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
    ).reverse(); // Show latest first
  }, [messages, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">Search Messages</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in chat..."
            autoFocus
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-4">
        {!searchQuery ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-40">
            <Search className="w-12 h-12 mb-4" />
            <p className="text-sm font-medium">Search for messages</p>
            <p className="text-xs mt-1">Find specific messages in this conversation</p>
          </div>
        ) : filteredMessages.length > 0 ? (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
              {filteredMessages.length} Results Found
            </p>
            {filteredMessages.map((msg) => (
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
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-40">
            <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <X className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">No results found</p>
            <p className="text-xs mt-1">Try different keywords or check for typos</p>
          </div>
        )}
      </div>
    </div>
  );
}
