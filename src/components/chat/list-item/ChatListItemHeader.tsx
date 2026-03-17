"use client";

import { cn } from "@/lib/utils";

interface ChatListItemHeaderProps {
  name: string;
  timestamp?: string;
  hasUnread: boolean;
}

export function ChatListItemHeader({ name, timestamp, hasUnread }: ChatListItemHeaderProps) {
  return (
    <div className="flex justify-between items-baseline mb-0.5">
      <h3 className={cn(
        "text-[15px] truncate text-gray-900 dark:text-gray-100",
        hasUnread ? "font-black" : "font-bold"
      )}>
        {name}
      </h3>
      <span
        className={cn(
          "text-[10px] uppercase tracking-wider tabular-nums",
          hasUnread
            ? "text-blue-600 font-black"
            : "text-gray-400 dark:text-gray-500",
        )}
      >
        {timestamp}
      </span>
    </div>
  );
}
