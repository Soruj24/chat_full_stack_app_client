"use client";

import { Search, X } from "lucide-react";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SidebarSearch({ value, onChange, onClear }: SidebarSearchProps) {
  return (
    <div className="relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
      <input
        type="text"
        placeholder="Search messages, users..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 border border-transparent focus:bg-white dark:focus:bg-gray-800 dark:text-gray-100"
      />
      {value && (
        <button 
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
