"use client";

import { X } from "lucide-react";

interface ForwardModalHeaderProps {
  onClose: () => void;
}

export function ForwardModalHeader({ onClose }: ForwardModalHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Forward Message
        </h3>
        <p className="text-xs text-gray-500">
          Select chats to forward this message to
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
