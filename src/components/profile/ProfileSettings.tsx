"use client";

import { motion } from "framer-motion";
import { Bell, Lock, Slash, Trash2 } from "lucide-react";

export function ProfileSettings() {
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
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</span>
          </div>
          <span className="text-sm text-blue-500">On</span>
        </button>
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Lock className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Encryption</span>
        </button>
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-red-500">
          <Slash className="w-5 h-5" />
          <span className="text-sm font-medium">Block User</span>
        </button>
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-red-500">
          <Trash2 className="w-5 h-5" />
          <span className="text-sm font-medium">Clear Chat</span>
        </button>
      </div>
    </motion.div>
  );
}
