"use client";

import { ArrowDown } from "lucide-react";

interface ScrollToBottomButtonProps {
  isVisible: boolean;
  unreadCount: number;
  onClick: () => void;
}

export function ScrollToBottomButton({
  isVisible,
  unreadCount,
  onClick
}: ScrollToBottomButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="absolute bottom-24 right-4 md:right-8 flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all animate-in fade-in zoom-in duration-200 z-20"
    >
      {unreadCount > 0 && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">
          {unreadCount}
        </span>
      )}
      <ArrowDown className="w-5 h-5" />
    </button>
  );
}
