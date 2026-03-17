"use client";

import { Users, Camera } from "lucide-react";

interface GroupDetailsStepProps {
  groupName: string;
  onGroupNameChange: (name: string) => void;
  description: string;
  onDescriptionChange: (desc: string) => void;
}

export function GroupDetailsStep({
  groupName,
  onGroupNameChange,
  description,
  onDescriptionChange,
}: GroupDetailsStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 py-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center ring-4 ring-blue-500/10 shadow-xl overflow-hidden">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-90">
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
            Group Name
          </label>
          <input
            type="text"
            placeholder="Enter group name..."
            value={groupName}
            onChange={(e) => onGroupNameChange(e.target.value)}
            autoFocus
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
            Description (Optional)
          </label>
          <textarea
            placeholder="What's this group about?"
            rows={3}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
