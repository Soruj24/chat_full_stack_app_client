"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IChat, Message } from "@/lib/types";
import { useState } from "react";
import { ChatInfoMainView } from "./info-panel/ChatInfoMainView";
import { ChatMediaView } from "./info-panel/ChatMediaView";
import { ChatStarredView } from "./info-panel/ChatStarredView";
import { ChatWallpaperView } from "./info-panel/ChatWallpaperView";
import { ChatSearchView } from "./info-panel/ChatSearchView";
import { ChatThemeView } from "./info-panel/ChatThemeView";

interface ChatInfoPanelProps {
  chat: IChat;
  messages?: Message[];
  onClose: () => void;
  onWallpaperChange?: (url: string) => void;
  onThemeChange?: (color: string) => void;
  starredMessages?: Message[];
  onMessageClick?: (messageId: string) => void;
}

export interface Wallpaper {
  id: string;
  url: string;
  label: string;
  category: "Default" | "Solid Colors" | "Abstract" | "Nature" | "Patterns";
}

const WALLPAPERS: Wallpaper[] = [
  { id: 'default', url: '', label: 'Default', category: 'Default' },
  // Solid Colors
  { id: 'solid-1', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop', label: 'Dark Blue', category: 'Solid Colors' },
  { id: 'solid-2', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop', label: 'Dark Grey', category: 'Solid Colors' },
  { id: 'solid-3', url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=1000&auto=format&fit=crop', label: 'Light Purple', category: 'Solid Colors' },
  
  // Abstract
  { id: 'abstract-1', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop', label: 'Dark Abstract', category: 'Abstract' },
  { id: 'abstract-2', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop', label: 'Vibrant Flow', category: 'Abstract' },
  { id: 'abstract-3', url: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?q=80&w=1000&auto=format&fit=crop', label: 'Liquid Smoke', category: 'Abstract' },

  // Nature
  { id: 'nature-1', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop', label: 'Misty Mountains', category: 'Nature' },
  { id: 'nature-2', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop', label: 'Scenic Lake', category: 'Nature' },
  { id: 'nature-3', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop', label: 'Deep Forest', category: 'Nature' },

  // Patterns
  { id: 'pattern-1', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', label: 'Minimalist Lines', category: 'Patterns' },
  { id: 'pattern-2', url: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=1000&auto=format&fit=crop', label: 'Subtle Texture', category: 'Patterns' },
  { id: 'pattern-3', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1000&auto=format&fit=crop', label: 'Wooden Surface', category: 'Patterns' },
];

export function ChatInfoPanel({ chat, messages = [], onClose, onWallpaperChange, onThemeChange, starredMessages, onMessageClick }: ChatInfoPanelProps) {
  const [viewMode, setViewMode] = useState<"info" | "media" | "wallpaper" | "starred" | "search" | "theme">("info");

  // Generate more media for "View All" mode
  const allMedia = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/${chat.id}-${i}/400`
  }));

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-y-0 right-0 w-full md:w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col shadow-2xl"
    >
      <AnimatePresence mode="wait">
        {viewMode === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ChatInfoMainView 
              chat={chat}
              onClose={onClose}
              setViewMode={setViewMode}
              starredMessages={starredMessages}
              allMedia={allMedia}
            />
          </motion.div>
        )}

        {viewMode === "media" && (
          <motion.div
            key="media"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ChatMediaView 
              allMedia={allMedia}
              onBack={() => setViewMode("info")}
            />
          </motion.div>
        )}

        {viewMode === "starred" && (
          <motion.div
            key="starred"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ChatStarredView 
              starredMessages={starredMessages}
              chat={chat}
              onBack={() => setViewMode("info")}
              onMessageClick={onMessageClick}
            />
          </motion.div>
        )}

        {viewMode === "wallpaper" && (
          <motion.div
            key="wallpaper"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ChatWallpaperView 
              chat={chat}
              wallpapers={WALLPAPERS}
              onBack={() => setViewMode("info")}
              onWallpaperChange={onWallpaperChange}
            />
          </motion.div>
        )}

        {viewMode === "search" && (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ChatSearchView 
              messages={messages}
              chat={chat}
              onBack={() => setViewMode("info")}
              onMessageClick={onMessageClick}
            />
          </motion.div>
        )}

        {viewMode === "theme" && (
          <motion.div
            key="theme"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ChatThemeView 
              chat={chat}
              onBack={() => setViewMode("info")}
              onThemeChange={onThemeChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
