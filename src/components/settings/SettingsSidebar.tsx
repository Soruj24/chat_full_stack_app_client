"use client";

import { LogOut, X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
  menuItems: readonly MenuItem[];
}

export function SettingsSidebar({
  activeTab,
  onTabChange,
  onClose,
  menuItems
}: SettingsSidebarProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth");
  };

  return (
    <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">Settings</h2>
        <button 
          onClick={onClose}
          className="p-2 md:hidden hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl text-sm font-semibold transition-all mt-auto"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
