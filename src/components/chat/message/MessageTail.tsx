"use client";

import { cn } from "@/lib/utils";

interface MessageTailProps {
  isMe: boolean;
  themeColor?: string;
}

export function MessageTail({ isMe, themeColor }: MessageTailProps) {
  return (
    <div 
      className={cn(
        "absolute top-0 w-2.5 h-2.5",
        isMe 
          ? "-right-[5px]" 
          : "-left-[5px]",
        isMe 
          ? (!themeColor && "bg-blue-600") 
          : "bg-gray-200 dark:bg-gray-800"
      )} 
      style={{
        backgroundColor: isMe && themeColor ? themeColor : undefined,
        clipPath: isMe 
          ? "path('M 0 0 C 0 0, 10 0, 10 0 C 10 0, 0 10, 0 10 Z')" 
          : "path('M 10 0 C 10 0, 0 0, 0 0 C 0 0, 10 10, 10 10 Z')"
      }}
    />
  );
}
