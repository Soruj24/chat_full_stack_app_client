"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

import { IChat } from "@/lib/types";

interface GroupCardProps {
  chat: IChat;
}

export function GroupCard({ chat }: GroupCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      <div className="p-8 flex flex-col items-center text-center">
        <div className="relative">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={
                (chat.avatar && chat.avatar.trim() !== "")
                  ? chat.avatar
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name || "Group")}`
              }
              alt={chat.name || "Group avatar"}
              fill
              unoptimized
              className="rounded-3xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
          </div>
          <button className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-10">
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {chat.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {chat.members?.length} members
        </p>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center italic text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
        &ldquo;{chat.description || "No description provided."}&rdquo;
      </div>
    </motion.div>
  );
}
