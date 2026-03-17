"use client";

import { ArrowLeft, Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { IChat } from "@/lib/types";
import { useState } from "react";
import { motion } from "framer-motion";

interface ChatThemeViewProps {
  chat: IChat;
  onBack: () => void;
  onThemeChange?: (color: string) => void;
}

const THEME_COLORS = [
  { name: "Default Blue", value: "#3b82f6", bg: "bg-blue-500" },
  { name: "Emerald Green", value: "#10b981", bg: "bg-emerald-500" },
  { name: "Royal Purple", value: "#8b5cf6", bg: "bg-purple-500" },
  { name: "Sunset Orange", value: "#f59e0b", bg: "bg-amber-500" },
  { name: "Rose Pink", value: "#f43f5e", bg: "bg-rose-500" },
  { name: "Cyan Breeze", value: "#06b6d4", bg: "bg-cyan-500" },
  { name: "Slate Grey", value: "#64748b", bg: "bg-slate-500" },
  { name: "Dark Indigo", value: "#4338ca", bg: "bg-indigo-700" },
  { name: "Crimson Red", value: "#dc2626", bg: "bg-red-600" },
  { name: "Golden Yellow", value: "#eab308", bg: "bg-yellow-500" },
];

export function ChatThemeView({ chat, onBack, onThemeChange }: ChatThemeViewProps) {
  const [selectedColor, setSelectedColor] = useState(chat.themeColor || "#3b82f6");

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onThemeChange?.(color);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">Theme Color</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Personalize chat accents</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {/* Preview Section */}
        <div className="mb-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex flex-col gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Preview</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
              <div className="p-3 rounded-2xl rounded-bl-none bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 max-w-[80%]">
                <p className="text-sm text-gray-600 dark:text-gray-300">This is how messages look!</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <div 
                className="p-3 rounded-2xl rounded-br-none shadow-sm max-w-[80%] transition-colors duration-300"
                style={{ backgroundColor: selectedColor }}
              >
                <p className="text-sm text-white font-medium">I love this theme!</p>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mr-1">Read</p>
            </div>
          </div>
        </div>

        {/* Color Selection Grid */}
        <div className="grid grid-cols-5 gap-4">
          {THEME_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              className="flex flex-col items-center gap-2 group"
            >
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95",
                  color.bg,
                  selectedColor === color.value && "ring-4 ring-offset-2 dark:ring-offset-gray-900 ring-blue-500/20"
                )}
              >
                {selectedColor === color.value && (
                  <Check className="w-5 h-5 text-white" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl">
          <div className="flex gap-3">
            <Palette className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Theme Applied</p>
              <p className="text-[11px] text-blue-500/80 dark:text-blue-400/60 leading-relaxed mt-1">
                The theme color will be applied to message bubbles, buttons, and accents throughout this specific chat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
