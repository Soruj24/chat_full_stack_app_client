"use client";

import { Smile, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputActionsProps {
  showEmojiPicker: boolean;
  onEmojiPickerToggle: () => void;
  isAttachmentMenuOpen: boolean;
  onAttachmentMenuToggle: () => void;
  themeColor?: string;
}

export function InputActions({
  showEmojiPicker,
  onEmojiPickerToggle,
  isAttachmentMenuOpen,
  onAttachmentMenuToggle,
  themeColor,
}: InputActionsProps) {
  const handleAttachmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAttachmentMenuToggle();
  };

  return (
    <div className="flex items-center mb-0.5">
      <button 
        type="button"
        onClick={onEmojiPickerToggle}
        className={cn(
          "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200",
          showEmojiPicker ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30" : "text-gray-400 dark:text-gray-500"
        )}
        style={showEmojiPicker && themeColor ? { backgroundColor: `${themeColor}20`, color: themeColor } : {}}
      >
        <Smile className="w-5 h-5" />
      </button>
      <button 
        type="button"
        onClick={handleAttachmentClick}
        className={cn(
          "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200",
          isAttachmentMenuOpen ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30" : "text-gray-400 dark:text-gray-500"
        )}
        style={isAttachmentMenuOpen && themeColor ? { backgroundColor: `${themeColor}20`, color: themeColor } : {}}
      >
        <Paperclip className="w-5 h-5" />
      </button>
    </div>
  );
}
