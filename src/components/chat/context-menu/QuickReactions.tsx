"use client";

interface QuickReactionsProps {
  emojis: string[];
  onReact: (emoji: string) => void;
  onClose: () => void;
}

export function QuickReactions({ emojis, onReact, onClose }: QuickReactionsProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50 dark:border-gray-700 gap-1">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onReact(emoji);
            onClose();
          }}
          className="text-xl hover:scale-125 transition-transform p-1"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
