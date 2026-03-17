"use client";

import { IChat } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChatAvatar } from "./list-item/ChatAvatar";
import { ChatListItemContent } from "./list-item/ChatListItemContent";
import { ChatContextMenu } from "./list-item/ChatContextMenu";
import { SwipeBackground } from "./list-item/SwipeBackground";
import { useChatListItemActions } from "@/hooks/useChatListItemActions";

interface ChatListItemProps {
  chat: IChat;
  isActive: boolean;
  onPin?: (id: string) => void;
  onMute?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ChatListItem({ chat, isActive, onPin, onMute, onArchive, onDelete }: ChatListItemProps) {
  const {
    showContextMenu,
    setShowContextMenu,
    menuPosition,
    menuRef,
    handleContextMenu,
    handleDragEnd,
  } = useChatListItemActions(chat.id, onPin, onArchive);

  return (
    <div 
      className="relative overflow-hidden group"
      onContextMenu={handleContextMenu}
    >
      <SwipeBackground />

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className={cn(
          "relative z-10 flex items-center gap-3 p-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer active:scale-[0.98] select-none",
          isActive && "bg-blue-50 dark:bg-blue-900/20 shadow-inner"
        )}
      >
        {/* only render valid destination; guard against undefined/empty id */}
        {chat.id ? (
          <Link href={`/chat/${chat.id}`} className="absolute inset-0 z-20" />
        ) : null}
        
        <ChatAvatar 
          avatar={chat.avatar} 
          name={chat.name} 
          status={chat.status} 
        />

        <ChatListItemContent chat={chat} />

        {isActive && (
          <motion.div
            layoutId="active-chat"
            className="absolute left-0 top-1 bottom-1 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          />
        )}
      </motion.div>

      <AnimatePresence>
        {showContextMenu && (
          <ChatContextMenu 
            chat={chat}
            menuRef={menuRef}
            menuPosition={menuPosition}
            onPin={onPin}
            onMute={onMute}
            onArchive={onArchive}
            onDelete={onDelete}
            onClose={() => setShowContextMenu(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
