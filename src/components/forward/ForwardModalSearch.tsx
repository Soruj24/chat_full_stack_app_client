"use client";

import { Search } from "lucide-react";

interface ForwardModalSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ForwardModalSearch({ value, onChange }: ForwardModalSearchProps) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>
    </div>
  );
}
