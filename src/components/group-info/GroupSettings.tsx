"use client";

import { motion } from "framer-motion";
import { Bell, ShieldCheck, Settings, LogOut } from "lucide-react";

export function GroupSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mute Notifications
            </span>
          </div>
          <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full relative">
            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
          </div>
        </button>
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <ShieldCheck className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Group Permissions
          </span>
        </button>
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Group Settings
          </span>
        </button>
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-red-500">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Exit Group</span>
        </button>
      </div>
    </motion.div>
  );
}
