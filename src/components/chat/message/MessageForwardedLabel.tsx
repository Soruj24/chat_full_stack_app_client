"use client";

import { CornerUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageForwardedLabelProps {
  isMe: boolean;
}

export function MessageForwardedLabel({ isMe }: MessageForwardedLabelProps) {
  return (
    <div className={cn(
      "px-3 pt-1.5 flex items-center gap-1 opacity-60 italic",
      isMe ? "text-blue-50" : "text-gray-500"
    )}>
      <CornerUpRight className="w-3 h-3" />
      <span className="text-[10px]">Forwarded</span>
    </div>
  );
}
