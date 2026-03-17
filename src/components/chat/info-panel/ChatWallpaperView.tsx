"use client";

import { ArrowLeft, Image as ImageIcon, Check, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IChat } from "@/lib/types";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Wallpaper {
  id: string;
  url: string;
  label: string;
  category: string;
}

interface ChatWallpaperViewProps {
  chat: IChat;
  wallpapers: Wallpaper[];
  onBack: () => void;
  onWallpaperChange?: (url: string) => void;
}

const CATEGORIES = ["All", "Default", "Solid Colors", "Abstract", "Nature", "Patterns"];

export function ChatWallpaperView({ chat, wallpapers, onBack, onWallpaperChange }: ChatWallpaperViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [previewWallpaper, setPreviewWallpaper] = useState<Wallpaper | null>(null);

  const filteredWallpapers = useMemo(() => {
    if (selectedCategory === "All") return wallpapers;
    return wallpapers.filter(wp => wp.category === selectedCategory);
  }, [wallpapers, selectedCategory]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Wallpaper View Header */}
      <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">Wallpaper</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Customize your chat</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto p-4 gap-2 no-scrollbar border-b border-gray-100 dark:border-gray-800">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-all",
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Wallpaper Grid */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="grid grid-cols-2 gap-3">
          {filteredWallpapers.map((wp) => (
            <div key={wp.id} className="relative group">
              <button 
                onClick={() => setPreviewWallpaper(wp)}
                className={cn(
                  "w-full aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02]",
                  chat.wallpaper === wp.url 
                    ? "border-blue-500 ring-2 ring-blue-500/20" 
                    : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                )}
              >
                {wp.url ? (
                  <img src={wp.url} alt={wp.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-[10px] font-bold text-white uppercase truncate">{wp.label}</p>
                </div>
                {chat.wallpaper === wp.url && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Overlay */}
      <AnimatePresence>
        {previewWallpaper && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black flex flex-col"
          >
            {/* Preview Header */}
            <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
              <button 
                onClick={() => setPreviewWallpaper(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <p className="text-white text-sm font-bold uppercase tracking-widest">{previewWallpaper.label}</p>
                <p className="text-white/60 text-[10px] font-medium uppercase">{previewWallpaper.category}</p>
              </div>
              <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Preview Image */}
            <div className="flex-1 relative overflow-hidden">
              {previewWallpaper.url ? (
                <img 
                  src={previewWallpaper.url} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-700" />
                  <p className="absolute bottom-1/2 mt-10 text-gray-500 font-bold uppercase text-xs">Default Theme</p>
                </div>
              )}
              
              {/* Mock Chat Content Overlay */}
              <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-end gap-4 pb-32">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl rounded-bl-none max-w-[80%] self-start border border-white/10">
                  <p className="text-white text-sm">How does this wallpaper look?</p>
                </div>
                <div className="bg-blue-600/80 backdrop-blur-md p-3 rounded-2xl rounded-br-none max-w-[80%] self-end border border-white/10">
                  <p className="text-white text-sm">It looks amazing! Very clean.</p>
                </div>
              </div>
            </div>

            {/* Preview Footer */}
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
              <button 
                onClick={() => {
                  onWallpaperChange?.(previewWallpaper.url);
                  setPreviewWallpaper(null);
                }}
                className={cn(
                  "w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-wider transition-all",
                  chat.wallpaper === previewWallpaper.url
                    ? "bg-gray-800 text-gray-400 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                )}
                disabled={chat.wallpaper === previewWallpaper.url}
              >
                {chat.wallpaper === previewWallpaper.url ? (
                  <>
                    <Check className="w-5 h-5" />
                    Currently Set
                  </>
                ) : (
                  "Set as Wallpaper"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
