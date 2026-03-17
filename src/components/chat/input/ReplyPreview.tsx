"use client";

import { ChevronLeft } from "lucide-react";
import { Message } from "@/lib/types";

interface ReplyPreviewProps {
  replyingTo: Message;
  onCancel: () => void;
}

export function ReplyPreview({ replyingTo, onCancel }: ReplyPreviewProps) {
  return (
    <div className="mb-2 p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-between animate-in slide-in-from-bottom-1 duration-200 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="w-0.5 h-6 bg-blue-600 rounded-full shrink-0" />
        <div className="min-w-0">
          <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">
            Replying to {replyingTo.senderName || 'User'}
          </p>
          <p className="text-[11px] text-gray-500 truncate leading-tight">
            {replyingTo.text || 'Media message'}
          </p>
        </div>
      </div>
      <button 
        onClick={onCancel} 
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
      </button>
    </div>
  );
}
