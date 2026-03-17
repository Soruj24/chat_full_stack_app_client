"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Theme } from "emoji-picker-react";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface MessageQuickReactionsProps {
  message: Message;
  isMe: boolean;
  onReaction: (message: Message, emoji: string) => void;
  onClose: () => void;
  innerRef: React.RefObject<HTMLDivElement | null>;
}

const QUICK_EMOJIS = ["❤️", "😂", "😮", "😢", "🙏", "👍", "🔥", "🎉"];

export function MessageQuickReactions({ 
  message, 
  isMe, 
  onReaction, 
  onClose,
  innerRef 
}: MessageQuickReactionsProps) {
  const [showFullPicker, setShowFullPicker] = useState(false);

  return (
    <div className="relative">
      <motion.div
        ref={innerRef}
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        className={cn(
          "absolute -top-12 z-[60] bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-100 dark:border-gray-700 p-1 flex items-center gap-0.5",
          isMe ? "right-0" : "left-0"
        )}
      >
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onReaction(message, emoji);
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all hover:scale-125 active:scale-90 text-lg"
          >
            {emoji}
          </button>
        ))}
        
        <button
          onClick={() => setShowFullPicker(!showFullPicker)}
          className={cn(
            "w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all hover:scale-110 active:scale-90 text-gray-400",
            showFullPicker && "bg-gray-100 dark:bg-gray-700 text-blue-500"
          )}
        >
          <Plus className="w-5 h-5" />
        </button>
      </motion.div>

      <AnimatePresence>
        {showFullPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className={cn(
              "absolute bottom-0 z-[70] shadow-2xl rounded-2xl overflow-hidden",
              isMe ? "right-0" : "left-0"
            )}
            style={{ marginBottom: "50px" }}
          >
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                onReaction(message, emojiData.emoji);
                onClose();
              }}
              autoFocusSearch={true}
              theme={Theme.AUTO}
              width={300}
              height={400}
              searchPlaceHolder="Search emoji..."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
