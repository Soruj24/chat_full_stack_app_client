"use client";

import { Search, X, UserPlus } from "lucide-react";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserSelectionStepProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUsers: Set<string>;
  onToggleUser: (userId: string) => void;
  filteredUsers: User[];
  allUsers: User[];
}

export function UserSelectionStep({
  searchQuery,
  onSearchChange,
  selectedUsers,
  onToggleUser,
  filteredUsers,
  allUsers,
}: UserSelectionStepProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-none"
        />
      </div>

      {/* Selected Users Pills */}
      {selectedUsers.size > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {Array.from(selectedUsers)
            .map((userId) => allUsers.find((u) => u.id === userId))
            .filter((user): user is User => !!user)
            .map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold animate-in zoom-in duration-200"
              >
                <img
                  src={
                    user.avatar && user.avatar.trim() !== ""
                      ? user.avatar
                      : "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(user.name || "User")
                  }
                  alt=""
                  className="w-4 h-4 rounded-full"
                />
                <span>{user.name}</span>
                <button onClick={() => onToggleUser(user.id)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Users List */}
      <div className="space-y-1">
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => onToggleUser(user.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group",
              selectedUsers.has(user.id)
                ? "bg-blue-50 dark:bg-blue-900/20"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <div className="relative">
              <img
                src={
                  user.avatar && user.avatar.trim() !== ""
                    ? user.avatar
                    : "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user.name || "User")
                }
                alt=""
                className="w-12 h-12 rounded-full ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all"
              />
              {selectedUsers.has(user.id) && (
                <div className="absolute -top-1 -right-1 bg-blue-600 text-white p-1 rounded-full shadow-lg">
                  <UserPlus className="w-3 h-3" />
                </div>
              )}
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{user.name}</h4>
              <p className="text-xs text-gray-500">{user.username}</p>
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center",
                selectedUsers.has(user.id)
                  ? "bg-blue-600 border-blue-600"
                  : "border-gray-200 dark:border-gray-700"
              )}
            >
              {selectedUsers.has(user.id) && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
