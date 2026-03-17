"use client";

import { cn } from "@/lib/utils";

interface Reaction {
  emoji: string;
  count: number;
  me?: boolean;
}

interface MessageReactionsProps {
  reactions: Reaction[];
  isMe: boolean;
  onReactionClick?: (emoji: string) => void;
}

export function MessageReactions({ reactions, isMe, onReactionClick }: MessageReactionsProps) {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className={cn(
      "absolute -bottom-2 flex gap-1",
      isMe ? "right-2" : "left-2"
    )}>
      {reactions.map((reaction, i) => (
        <button
          key={i}
          onClick={() => onReactionClick?.(reaction.emoji)}
          className={cn(
            "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] shadow-sm border transition-all active:scale-90",
            reaction.me 
              ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700" 
              : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
          )}
        >
          <span>{reaction.emoji}</span>
          {reaction.count > 1 && <span className="font-bold">{reaction.count}</span>}
        </button>
      ))}
    </div>
  );
}
