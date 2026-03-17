"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function useForwardModal(onForward: (chatIds: string[]) => void, onClose: () => void) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatIds, setSelectedChatIds] = useState<Set<string>>(new Set());
  const { chats } = useSelector((state: RootState) => state.chat);

  const filteredChats = chats.filter((chat) => {
    const name = (chat.name || "").toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const toggleChatSelection = (chatId: string) => {
    const next = new Set(selectedChatIds);
    if (next.has(chatId)) next.delete(chatId);
    else next.add(chatId);
    setSelectedChatIds(next);
  };

  const handleForward = () => {
    onForward(Array.from(selectedChatIds));
    onClose();
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedChatIds,
    filteredChats,
    toggleChatSelection,
    handleForward,
  };
}
