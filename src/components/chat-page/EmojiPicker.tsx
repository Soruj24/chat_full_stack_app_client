"use client";

interface EmojiPickerProps {
  isOpen: boolean;
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ isOpen, onSelect }: EmojiPickerProps) {
  if (!isOpen) return null;

  const emojis = [
    "😀", "😂", "🤣", "😍", "😒", "😭", 
    "😩", "😔", "😘", "☺️", "😁", "🔥", 
    "👍", "❤️", "✨", "🙌", "🎉", "🚀"
  ];

  return (
    <div className="absolute bottom-20 left-4 z-20 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 w-72 h-80 overflow-y-auto animate-in slide-in-from-bottom-2 duration-200">
      <div className="grid grid-cols-6 gap-2">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg transition-colors"
            onClick={() => onSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
