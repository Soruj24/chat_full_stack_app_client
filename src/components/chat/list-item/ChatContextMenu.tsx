"use client";

import { motion } from "framer-motion";
import { Pin, BellOff, Volume2, Archive, Trash2 } from "lucide-react";
import { IChat } from "@/lib/types";
import { RefObject } from "react";

interface ChatContextMenuProps {
  chat: IChat;
  menuRef: RefObject<HTMLDivElement | null>;
  menuPosition: { x: number; y: number };
  onPin?: (id: string) => void;
  onMute?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function ChatContextMenu({ 
  chat, 
  menuRef, 
  menuPosition, 
  onPin, 
  onMute, 
  onArchive, 
  onDelete,
  onClose 
}: ChatContextMenuProps) {
  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="fixed z-[100] w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-1 overflow-hidden"
      style={{ 
        left: Math.min(menuPosition.x, typeof window !== 'undefined' ? window.innerWidth - 200 : menuPosition.x), 
        top: Math.min(menuPosition.y, typeof window !== 'undefined' ? window.innerHeight - 250 : menuPosition.y) 
      }}
    >
      <button 
        onClick={() => { onPin?.(chat.id); onClose(); }}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      >
        <Pin className="w-4 h-4 text-gray-400" />
        <span className="font-medium">{chat.isPinned ? "Unpin Chat" : "Pin Chat"}</span>
      </button>
      <button 
        onClick={() => { onMute?.(chat.id); onClose(); }}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      >
        {chat.isMuted ? <Volume2 className="w-4 h-4 text-gray-400" /> : <BellOff className="w-4 h-4 text-gray-400" />}
        <span className="font-medium">{chat.isMuted ? "Unmute" : "Mute Notifications"}</span>
      </button>
      <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2" />
      <button 
        onClick={() => { onArchive?.(chat.id); onClose(); }}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      >
        <Archive className="w-4 h-4 text-gray-400" />
        <span className="font-medium">{chat.isArchived ? "Unarchive Chat" : "Archive Chat"}</span>
      </button>
      <button 
        onClick={() => { onDelete?.(chat.id); onClose(); }}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        <span className="font-medium">Delete Chat</span>
      </button>
    </motion.div>
  );
}
