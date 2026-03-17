"use client";

import { Loader2 } from "lucide-react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { DateSeparator } from "@/components/chat/DateSeparator";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { MessageListSkeleton } from "./MessageListSkeleton";
import { cn } from "@/lib/utils";
import { RefObject } from "react";
import { Message } from "@/lib/types";
import { motion } from "framer-motion";

interface MessageListProps {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  chatWallpaper?: string;
  themeColor?: string;
  isPaginationLoading: boolean;
  isLoading: boolean;
  localMessages: Message[];
  groupedMessages: { [key: string]: Message[] };
  messageRefs: RefObject<{ [key: string]: HTMLDivElement | null }>;
  highlightedMessageId: string | null;
  starredMessageIds: Set<string>;
  pinnedMessages: Message[];
  searchQuery: string;
  chatType: string;
  chatId: string;
  onImageClick: (url: string) => void;
  onReply: (message: Message) => void;
  onForward: (message: Message) => void;
  onLike: (message: Message) => void;
  onReaction: (message: Message, emoji: string) => void;
  onContextMenu: (e: React.MouseEvent, message: Message) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  isTyping?: boolean;
  typingUser?: string;
  fontSize?: 'small' | 'medium' | 'large';
  bubbleStyle?: 'modern' | 'classic' | 'rounded';
  accentColor?: string;
}

export function MessageList({
  scrollContainerRef,
  onScroll,
  chatWallpaper,
  themeColor,
  isPaginationLoading,
  isLoading,
  localMessages,
  groupedMessages,
  messageRefs,
  highlightedMessageId,
  starredMessageIds,
  pinnedMessages,
  searchQuery,
  chatType,
  chatId,
  onImageClick,
  onReply,
  onForward,
  onLike,
  onReaction,
  onContextMenu,
  messagesEndRef,
  isTyping,
  typingUser,
  fontSize = 'medium',
  bubbleStyle = 'modern',
  accentColor,
}: MessageListProps) {
  return (
    <div
      ref={scrollContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto p-4 custom-scrollbar relative"
    >
      {/* Professional Wallpaper Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.03] pointer-events-none bg-repeat"
        style={{
          backgroundImage: chatWallpaper
            ? `url('${chatWallpaper}')`
            : "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
          backgroundSize: chatWallpaper ? "cover" : "360px",
        }}
      />

      <div className="max-w-4xl mx-auto min-h-full flex flex-col relative z-10">
        {isPaginationLoading && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          </div>
        )}

        {isLoading ? (
          <div className="py-4">
            <MessageListSkeleton groupAvatar={chatType === "group"} />
          </div>
        ) : localMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-32 h-32 bg-gray-100 dark:bg-gray-800/30 rounded-full flex items-center justify-center mb-8 relative"
            >
              <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-ping" />
              <svg
                className="w-16 h-16 text-blue-500/40 dark:text-blue-500/20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                No messages yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[240px] leading-relaxed">
                Start a conversation by sending a message below.
              </p>
            </motion.div>
          </div>
        ) : (
          <>
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <DateSeparator date={date} />
                {msgs.map((msg, idx) => (
                  <div
                    key={msg.id || `${date}-${idx}`}
                    ref={(el) => {
                      if (messageRefs.current) {
                        const refKey = msg.id || `${date}-${idx}`;
                        messageRefs.current[refKey] = el;
                      }
                    }}
                    className={cn(
                      "transition-all duration-500 rounded-xl",
                      highlightedMessageId === msg.id &&
                        "bg-blue-500/10 ring-2 ring-blue-500/20",
                    )}
                  >
                    <MessageBubble
                      message={{
                        ...msg,
                        isStarred: starredMessageIds.has(msg.id),
                        isPinned: !!pinnedMessages.find(
                          (pm) => pm.id === msg.id,
                        ),
                      }}
                      onImageClick={onImageClick}
                      onReply={onReply}
                      onForward={onForward}
                      onLike={onLike}
                      onReaction={onReaction}
                      themeColor={themeColor}
                      showSenderName={chatType === "group"}
                      highlight={searchQuery}
                      onContextMenu={(e, message) => onContextMenu(e, message)}
                      fontSize={fontSize}
                      bubbleStyle={bubbleStyle}
                      accentColor={accentColor}
                    />
                  </div>
                ))}
              </div>
            ))}

            {isTyping && (
              <div className="mt-2">
                <TypingIndicator userName={typingUser || "Someone"} themeColor={themeColor} />
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
}
