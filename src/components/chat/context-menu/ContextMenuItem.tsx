"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ContextMenuItemProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "danger";
  iconColor?: string;
  iconFill?: boolean;
}

export function ContextMenuItem({
  label,
  icon: Icon,
  onClick,
  variant = "default",
  iconColor,
  iconFill
}: ContextMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left",
        variant === "danger" ? "text-red-500" : "text-gray-700 dark:text-gray-200"
      )}
    >
      <Icon 
        className={cn(
          "w-4 h-4", 
          iconColor && !iconFill ? iconColor : "",
          iconFill ? cn("fill-current", iconColor) : ""
        )} 
      />
      {label}
    </button>
  );
}
