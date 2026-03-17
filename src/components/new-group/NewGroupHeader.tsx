"use client";

import { X } from "lucide-react";

interface NewGroupHeaderProps {
  step: 1 | 2;
  selectedCount: number;
  onClose: () => void;
}

export function NewGroupHeader({ step, selectedCount, onClose }: NewGroupHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">
          {step === 1 ? "New Group" : "Group Details"}
        </h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
          {step === 1 ? `${selectedCount} members selected` : "Finalize your group"}
        </p>
      </div>
      <button 
        onClick={onClose}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
