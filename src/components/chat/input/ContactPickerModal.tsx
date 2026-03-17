"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, User } from "lucide-react";
import { IChat } from "@/lib/types";
import Image from "next/image";

interface ContactPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (contact: {
    name: string;
    phoneNumber: string;
    avatar?: string;
  }) => void;
}

export function ContactPickerModal({
  isOpen,
  onClose,
  onSelect,
}: ContactPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { chats } = useSelector((state: RootState) => state.chat);

  // Get all unique individual participants from chats
  const contacts = chats
    .filter((chat) => chat.type === "individual" || chat.type === "private")
    .filter((chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-lg">Select Contact</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
              {contacts.length > 0 ? (
                contacts.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      onSelect({
                        name: chat.name,
                        phoneNumber:
                          (chat as IChat & { phoneNumber?: string }).phoneNumber || "+880 1234 567890", // Use real phone if available
                        avatar: chat.avatar,
                      });
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-left"
                  >
                    <div className="relative">
                      {chat.avatar && chat.avatar.length > 0 ? (
                        <Image
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{chat.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {(chat as IChat & { phoneNumber?: string }).phoneNumber || "No phone number"}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <User className="w-12 h-12 mb-2 opacity-20" />
                  <p>No contacts found</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
