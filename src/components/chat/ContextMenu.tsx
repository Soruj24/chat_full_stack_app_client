"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Trash2, Share2, CornerUpRight, Pin, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { QuickReactions } from "./context-menu/QuickReactions";
import { ContextMenuItem } from "./context-menu/ContextMenuItem";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onForward: () => void;
  onReply: () => void;
  onPin: () => void;
  onStar: () => void;
  onReact: (emoji: string) => void;
  isPinned?: boolean;
  isStarred?: boolean;
}

export function ContextMenu({
  x,
  y,
  onClose,
  onCopy,
  onDelete,
  onForward,
  onReply,
  onPin,
  onStar,
  onReact,
  isPinned,
  isStarred,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  // Determine transform based on screen position to avoid overflow
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
  
  const isRightSide = x > screenWidth / 2;
  const isBottomSide = y > screenHeight / 2;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.9, y: isBottomSide ? 10 : -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: isBottomSide ? 10 : -10 }}
        className="fixed z-[100] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 min-w-[180px] overflow-hidden"
        style={{ 
          left: x, 
          top: y,
          transform: `translate(${isRightSide ? "-100%" : "0"}, ${isBottomSide ? "-100%" : "0"})`
        }}
      >
        <QuickReactions emojis={emojis} onReact={onReact} onClose={onClose} />

        <div className="flex flex-col">
          <ContextMenuItem
            label="Reply"
            icon={CornerUpRight}
            onClick={() => handleAction(onReply)}
            iconColor="text-blue-500"
          />
          <ContextMenuItem
            label={isStarred ? "Unstar" : "Star"}
            icon={Star}
            onClick={() => handleAction(onStar)}
            iconColor={
              isStarred ? "text-yellow-400" : "text-gray-400 dark:text-gray-400"
            }
            iconFill={isStarred}
          />
          <ContextMenuItem
            label={isPinned ? "Unpin" : "Pin"}
            icon={Pin}
            onClick={() => handleAction(onPin)}
            iconColor={
              isPinned ? "text-blue-400" : "text-gray-400 dark:text-gray-400"
            }
            iconFill={isPinned}
          />
          <ContextMenuItem
            label="Copy"
            icon={Copy}
            onClick={() => handleAction(onCopy)}
            iconColor="text-gray-400"
          />
          <ContextMenuItem
            label="Forward"
            icon={Share2}
            onClick={() => handleAction(onForward)}
            iconColor="text-green-500"
          />

          <div className="h-px bg-gray-50 dark:bg-gray-700 my-1" />

          <ContextMenuItem
            label="Delete"
            icon={Trash2}
            onClick={() => handleAction(onDelete)}
            variant="danger"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
