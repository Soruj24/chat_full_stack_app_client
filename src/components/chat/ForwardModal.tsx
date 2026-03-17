"use client";

import { motion } from "framer-motion";
import { ForwardChatList } from "../forward/ForwardChatList";
import { Message } from "@/lib/types";
import { ForwardModalHeader } from "../forward/ForwardModalHeader";
import { ForwardModalSearch } from "../forward/ForwardModalSearch";
import { ForwardModalFooter } from "../forward/ForwardModalFooter";
import { useForwardModal } from "@/hooks/useForwardModal";

interface ForwardModalProps {
  message: Message;
  onClose: () => void;
  onForward: (chatIds: string[]) => void;
}

export function ForwardModal({
  message,
  onClose,
  onForward,
}: ForwardModalProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedChatIds,
    filteredChats,
    toggleChatSelection,
    handleForward,
  } = useForwardModal(onForward, onClose);

  return (
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
        <ForwardModalHeader onClose={onClose} />

        <ForwardModalSearch value={searchQuery} onChange={setSearchQuery} />

        <ForwardChatList
          chats={filteredChats}
          selectedChatIds={selectedChatIds}
          onToggleChat={toggleChatSelection}
        />

        <ForwardModalFooter 
          selectedCount={selectedChatIds.size} 
          onForward={handleForward} 
        />
      </motion.div>
    </motion.div>
  );
}
