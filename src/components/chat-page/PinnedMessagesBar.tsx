"use client";

import { Message } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Pin, X } from "lucide-react";

interface PinnedMessagesBarProps {
  pinnedMessages: Message[];
  currentPinnedIndex: number;
  onNavigate: () => void;
  onClear: () => void;
}

export function PinnedMessagesBar({
  pinnedMessages,
  currentPinnedIndex,
  onNavigate,
  onClear
}: PinnedMessagesBarProps) {
  return (
    <AnimatePresence>
      {pinnedMessages.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 overflow-hidden z-10"
        >
          <div
            className="flex items-center justify-between px-4 py-2 gap-3 cursor-pointer group"
            onClick={onNavigate}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Pin className="w-4 h-4 text-blue-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                  Pinned Message{" "}
                  {pinnedMessages.length > 1
                    ? `(${currentPinnedIndex + 1}/${pinnedMessages.length})`
                    : ""}
                </p>
                <p className="text-xs text-gray-500 truncate group-hover:text-blue-500 transition-colors">
                  {pinnedMessages[currentPinnedIndex].text}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClear}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
