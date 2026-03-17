"use client";

import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SidebarFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: "all" | "unread" | "groups" | "archived") => void;
}

export function SidebarFilters({ activeFilter, onFilterChange }: SidebarFiltersProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const accentColor = user?.settings?.accentColor;

  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "groups", label: "Groups" },
    { id: "archived", label: "Archived" },
  ] as const;

  return (
    <div className="flex items-center gap-1.5 animate-in fade-in duration-300 overflow-x-auto no-scrollbar pb-1">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap",
            activeFilter === f.id 
              ? (!accentColor && "bg-blue-600 text-white shadow-sm shadow-blue-500/20")
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
          style={activeFilter === f.id && accentColor ? { backgroundColor: accentColor, color: '#fff', boxShadow: `${accentColor}33 0px 4px 12px` } : {}}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
