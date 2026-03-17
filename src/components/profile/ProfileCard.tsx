"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, Video, Search } from "lucide-react";

import { User } from "@/lib/types";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      <div className="p-8 flex flex-col items-center text-center">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={
              (user.avatar && user.avatar.trim() !== "")
                ? user.avatar
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}`
            }
            alt={user.name || "User profile picture"}
            fill
            unoptimized
            className="rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>
        <p className="text-blue-500 font-medium">{user.status}</p>
      </div>

      <div className="flex border-t border-gray-100 dark:border-gray-800">
        <button className="flex-1 py-4 flex flex-col items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-r border-gray-100 dark:border-gray-800">
          <Phone className="w-5 h-5 text-blue-500" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Audio</span>
        </button>
        <button className="flex-1 py-4 flex flex-col items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-r border-gray-100 dark:border-gray-800">
          <Video className="w-5 h-5 text-blue-500" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Video</span>
        </button>
        <button className="flex-1 py-4 flex flex-col items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Search className="w-5 h-5 text-blue-500" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Search</span>
        </button>
      </div>
    </motion.div>
  );
}
