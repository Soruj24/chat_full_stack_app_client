"use client";

import { Pin, Archive } from "lucide-react";

export function SwipeBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-between px-6 bg-gray-50 dark:bg-gray-800/50 shadow-inner">
      <div className="flex flex-col items-center gap-1 text-blue-500 animate-in slide-in-from-left-4 duration-300">
        <Pin className="w-5 h-5 fill-current" />
        <span className="text-[10px] font-black tracking-widest">PIN</span>
      </div>
      <div className="flex flex-col items-center gap-1 text-gray-400 animate-in slide-in-from-right-4 duration-300">
        <Archive className="w-5 h-5" />
        <span className="text-[10px] font-black tracking-widest">ARCHIVE</span>
      </div>
    </div>
  );
}
