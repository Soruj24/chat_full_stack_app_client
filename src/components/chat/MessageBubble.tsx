"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { CornerUpRight, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MessageContent } from "./message/MessageContent";
import { MessageQuickReactions } from "./message/MessageQuickReactions";
import { MessageActionButtons } from "./message/MessageActionButtons";
import { SwipeToReplyIndicator } from "./message/SwipeToReplyIndicator";
import { MessageTail } from "./message/MessageTail";
import { MessageLikeAnimation } from "./message/MessageLikeAnimation";
import { MessageHeader } from "./message/MessageHeader";
import { MessageFooter } from "./message/MessageFooter";
import { useMessageSwipe } from "@/hooks/useMessageSwipe";
import { useDoubleTap } from "@/hooks/useDoubleTap";
import Image from "next/image";
import { getUserColor } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  onImageClick?: (url: string) => void;
  onReply?: (message: Message) => void;
  onForward?: (message: Message) => void;
  onReaction?: (message: Message, emoji: string) => void;
  onContextMenu?: (e: React.MouseEvent, message: Message) => void;
  onLike?: (message: Message) => void;
  showSenderName?: boolean;
  highlight?: string;
  themeColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
  bubbleStyle?: 'modern' | 'classic' | 'rounded';
  accentColor?: string;
}

export function MessageBubble({ 
  message, 
  onImageClick, 
  onReply, 
  onForward, 
  onReaction,
  onContextMenu,
  onLike,
  themeColor,
  showSenderName,
  highlight,
  fontSize = 'medium',
  bubbleStyle = 'modern',
  accentColor
}: MessageBubbleProps) {
  const isMe = message.isMe;
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const quickReactionsRef = useRef<HTMLDivElement>(null);
  
  const { x, replyOpacity, replyScale, handleDragEnd } = useMessageSwipe(isMe, () => onReply?.(message));
  const { handleDoubleTap, showAnimation: showHeart } = useDoubleTap(() => onLike?.(message));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickReactionsRef.current && !quickReactionsRef.current.contains(event.target as Node)) {
        setShowQuickReactions(false);
      }
    };
    if (showQuickReactions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showQuickReactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x }}
      transition={{ 
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1]
      }}
      className={cn(
        "flex w-full mb-2 group px-4 relative touch-pan-y items-start gap-3",
        isMe ? "flex-row-reverse" : "flex-row"
      )}
      onClick={handleDoubleTap}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e, message);
      }}
    >
      {/* Sender Avatar */}
      <div className="flex-shrink-0 z-10 mt-0.5">
        <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-sm bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {message.senderAvatar ? (
            <Image
              src={message.senderAvatar}
              alt={message.senderName || "User"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className={cn(
              "w-full h-full flex items-center justify-center bg-gradient-to-br text-white text-xs font-semibold uppercase tracking-wider",
              getUserColor(message.senderName || "User")
            )}>
              {(message.senderName || "U").charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Swipe to reply indicator */}
      <SwipeToReplyIndicator 
        x={x} 
        replyOpacity={replyOpacity} 
        replyScale={replyScale} 
        isMe={isMe} 
      />

      <div className={cn(
        "flex flex-col relative",
        isMe ? "items-end" : "items-start",
        "max-w-[75%]"
      )}>
        {/* Like animation heart */}
        <MessageLikeAnimation showHeart={showHeart} />

        {/* Quick Reactions Bar */}
        <AnimatePresence>
          {showQuickReactions && (
            <MessageQuickReactions 
              message={message}
              isMe={isMe}
              onReaction={onReaction || (() => {})}
              onClose={() => setShowQuickReactions(false)}
              innerRef={quickReactionsRef}
            />
          )}
        </AnimatePresence>

        {/* Message Actions - Hover only */}
        <MessageActionButtons 
          message={message}
          isMe={isMe}
          showQuickReactions={showQuickReactions}
          setShowQuickReactions={setShowQuickReactions}
          onReply={onReply || (() => {})}
          onForward={onForward || (() => {})}
        />

        <div
          className={cn(
            "shadow-sm relative transition-all duration-200",
            bubbleStyle === 'modern' && (isMe ? "rounded-2xl rounded-tr-none" : "rounded-2xl rounded-tl-none"),
            bubbleStyle === 'classic' && "rounded-lg",
            bubbleStyle === 'rounded' && "rounded-3xl",
            message.type === 'image' 
              ? "bg-transparent shadow-none" 
              : isMe
                ? !themeColor && !accentColor && "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-transparent dark:border-gray-700 shadow-sm"
          )}
          style={isMe && (themeColor || accentColor) && message.type !== 'image' ? { backgroundColor: themeColor || accentColor, color: '#fff' } : {}}
        >
          {/* Tail Design */}
          {message.type !== 'image' && bubbleStyle === 'modern' && <MessageTail isMe={isMe} themeColor={themeColor || accentColor} />}

          {/* Message Header (Sender name, Reply, Forwarded) */}
          <MessageHeader 
            message={message} 
            isMe={isMe} 
            showSenderName={showSenderName} 
            themeColor={themeColor}
          />

          {/* Message Content */}
          <MessageContent 
            message={message} 
            isMe={isMe} 
            highlight={highlight} 
            onImageClick={onImageClick} 
            themeColor={themeColor}
            fontSize={fontSize}
            bubbleStyle={bubbleStyle}
          />

          {/* Message Footer (Timestamp, Status, Reactions) - Hide for images as it's overlaid */}
          {message.type !== 'image' && (
            <MessageFooter 
              message={message} 
              isMe={isMe} 
              onReactionClick={(emoji) => onReaction?.(message, emoji)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
