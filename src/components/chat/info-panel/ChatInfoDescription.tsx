"use client";

interface ChatInfoDescriptionProps {
  description?: string;
  isGroup: boolean;
}

export function ChatInfoDescription({ description, isGroup }: ChatInfoDescriptionProps) {
  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</h4>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {description || (isGroup ? "No group description provided." : "Hello! I am using this awesome chat app.")}
      </p>
    </div>
  );
}
