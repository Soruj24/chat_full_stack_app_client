"use client";

import { Send } from "lucide-react";

interface ForwardModalFooterProps {
  selectedCount: number;
  onForward: () => void;
}

export function ForwardModalFooter({ selectedCount, onForward }: ForwardModalFooterProps) {
  return (
    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
      <span className="text-xs font-medium text-gray-500">
        {selectedCount} chat{selectedCount !== 1 && "s"}{" "}
        selected
      </span>
      <button
        disabled={selectedCount === 0}
        onClick={onForward}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-blue-500/20"
      >
        Forward <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
