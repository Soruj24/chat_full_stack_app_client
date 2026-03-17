"use client";

import Image from "next/image";
import { Settings, Edit, Sun, Moon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SidebarHeaderProps {
  mounted: boolean;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  onSettingsOpen: () => void;
  onNewGroupOpen: () => void;
}

export function SidebarHeader({
  mounted,
  theme,
  setTheme,
  onSettingsOpen,
  onNewGroupOpen
}: SidebarHeaderProps) {
  const { user } = useSelector((state: RootState) => state.auth);
console.log(user);
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0D8ABC&color=fff&bold=true`;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 group cursor-pointer" onClick={onSettingsOpen}>
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name || "User"}
              fill
              unoptimized
              className="rounded-full ring-2 ring-blue-500/20 shadow-md object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <Image
              src={defaultAvatar}
              alt={user?.name || user?.username || user?.email || "User"}
              fill
              unoptimized
              className="rounded-full ring-2 ring-blue-500/20 shadow-md object-cover transition-transform group-hover:scale-105"
            />
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[15px] font-black tracking-tight text-gray-900 dark:text-gray-100 leading-none mb-1">
            {user?.username || (user as { username?: string })?.username || user?.email || ""}
          </h1>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 text-gray-500"
          title="Toggle theme"
        >
          {!mounted ? (
            <div className="w-5 h-5" />
          ) : theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
        <button 
          onClick={onSettingsOpen}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 text-gray-500"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button 
          onClick={onNewGroupOpen}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 active:scale-90 shadow-md shadow-blue-500/20"
        >
          <Edit className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
