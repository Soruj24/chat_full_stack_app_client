"use client";

import { Bell, Palette, Star, Shield, LogOut, ChevronRight } from "lucide-react";
 
interface ChatInfoActionsProps {
  isGroup: boolean;
  starredMessagesCount: number;
  setViewMode: (mode: "info" | "media" | "wallpaper" | "starred" | "search" | "theme") => void;
}

export function ChatInfoActions({ isGroup, starredMessagesCount, setViewMode }: ChatInfoActionsProps) {
  return (
    <div className="p-2">
      <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-3">
          <Bell className="w-4 h-4" />
          <span className="text-sm font-medium">Mute Notifications</span>
        </div>
        <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded-full relative">
          <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" />
        </div>
      </button>
      <button 
        onClick={() => setViewMode("theme")}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-gray-700 dark:text-gray-300"
      >
        <div className="flex items-center gap-3">
          <Palette className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">Theme Color</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </button>
      <button 
        onClick={() => setViewMode("wallpaper")}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-gray-700 dark:text-gray-300"
      >
        <div className="flex items-center gap-3">
          <Palette className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium">Chat Wallpaper</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </button>
      <button 
        onClick={() => setViewMode("starred")}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-gray-700 dark:text-gray-300"
      >
        <div className="flex items-center gap-3">
          <Star className="w-4 h-4" />
          <span className="text-sm font-medium">Starred Messages</span>
        </div>
        <div className="flex items-center gap-2">
          {starredMessagesCount > 0 && (
            <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded-full">
              {starredMessagesCount}
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </button>
      <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-gray-700 dark:text-gray-300">
        <Shield className="w-4 h-4" />
        <span className="text-sm font-medium">Encryption</span>
      </button>
      <button className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors text-red-600">
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">{isGroup ? "Exit Group" : "Block User"}</span>
      </button>
    </div>
  );
}
