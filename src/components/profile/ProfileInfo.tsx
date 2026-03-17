"use client";

import { motion } from "framer-motion";
import { Info, Phone, Mail } from "lucide-react";

import { User } from "@/lib/types";

interface ProfileInfoProps {
  user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      <div className="p-4 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Info className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.bio}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bio</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Phone className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.phoneNumber}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mobile</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Mail className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Username</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
