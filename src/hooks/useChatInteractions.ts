import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { updateChat, removeMessage } from "@/store/slices/chatSlice";
import { updateUser } from "@/store/slices/authSlice";
import { socketService } from "@/lib/socket/socket-client";
import { Message } from "@/lib/types";

export function useChatInteractions(chatId?: string) {
  // sanitize parameter; guard against literal strings produced by casts
  const validChatId = chatId && chatId !== "undefined" && chatId !== "null" ? chatId : "";
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { chats } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(
    null,
  );
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    message: Message;
  } | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<Message[]>([]);
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);

  // Derive starred message IDs from user state instead of using useEffect
  const starredMessageIds = useMemo(() => {
    return new Set(
      (user?.starredMessages || []).map((m: string) => m.toString()),
    );
  }, [user?.starredMessages]);

  const handlePinMessage = async (message: Message) => {
    if (!token || !validChatId) return;
    try {
      const response = await fetch(`/api/messages/${message.id}/pin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const resData = await response.json();
        const data = resData.payload || resData; // Support both formats
        const currentChat = chats.find((c) => c.id === validChatId);
        if (currentChat) {
          const newPinnedMessages = data.isPinned
            ? [...(currentChat.pinnedMessageIds || []), message.id]
            : (currentChat.pinnedMessageIds || []).filter(
                (id: string) => id.toString() !== message.id,
              );

          dispatch(
            updateChat({
              chatId: validChatId,
              updates: { pinnedMessageIds: newPinnedMessages },
            }),
          );

          // Emit socket event for real-time sync
          socketService.emit("message_pin", {
            chatId: validChatId,
            messageId: message.id,
            isPinned: data.isPinned,
          });
        }
      }
    } catch (error) {
      console.error("Failed to pin message:", error);
    }
  };

  const handleStarMessage = async (message: Message) => {
    try {
      const response = await fetch(`/api/messages/${message.id}/star`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const resData = await response.json();
        const data = resData.payload || resData; // Support both formats
        const currentStarred = user?.starredMessages || [];
        const newStarred = data.isStarred
          ? [...currentStarred, message.id]
          : currentStarred.filter((id: string) => id.toString() !== message.id);

        dispatch(updateUser({ starredMessages: newStarred }));
      }
    } catch (error) {
      console.error("Failed to star message:", error);
    }
  };

  const handleReaction = async (
    message: { id: string; [key: string]: unknown },
    emoji: string,
  ) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/messages/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId: message.id,
          emoji,
        }),
      });
      if (response.ok) {
        // Socket update will handle the UI if it's working
      }
    } catch (error) {
      console.error("Failed to react to message:", error);
    }
  };

  const handleDeleteMessage = async (
    messageId: string,
    callback?: () => void,
  ) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        dispatch(removeMessage({ chatId: validChatId, messageId }));
        if (callback) callback();

        // Emit socket event for real-time sync
        if (validChatId) {
          socketService.emit("message_delete", {
            chatId: validChatId,
            messageId,
          });
        }
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return {
    showEmojiPicker,
    setShowEmojiPicker,
    replyingTo,
    setReplyingTo,
    forwardingMessage,
    setForwardingMessage,
    contextMenu,
    setContextMenu,
    lightboxUrl,
    setLightboxUrl,
    showInfo,
    setShowInfo,
    isSearchOpen,
    setIsSearchOpen,
    pinnedMessages,
    setPinnedMessages,
    currentPinnedIndex,
    setCurrentPinnedIndex,
    starredMessageIds,
    handlePinMessage,
    handleStarMessage,
    handleReaction,
    handleDeleteMessage,
  };
}
