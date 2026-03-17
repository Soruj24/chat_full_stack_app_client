"use client";

import { IChat } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ForwardChatItemProps {
  chat: IChat;
  isSelected: boolean;
  onToggle: () => void;
}

export function ForwardChatItem({ chat, isSelected, onToggle }: ForwardChatItemProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
          : "hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent"
      )}
    >
      <div className="relative w-10 h-10 shrink-0">
        {chat.avatar ? (
          <Image
            src={chat.avatar}
            alt={chat.name}
            fill
            unoptimized
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-bold">
            {chat.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
          {chat.name}
        </h4>
        <p className="text-xs text-gray-500 truncate">
          {chat.type === "group" ? `${chat.members?.length} members` : chat.status}
        </p>
      </div>
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
          isSelected
            ? "bg-blue-600 border-blue-600 text-white"
            : "border-gray-300 dark:border-gray-700"
        )}
      >
        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
    </div>
  );
}
