import { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Message } from "@/lib/types";
import { formatFileSize, getFileNameFromUrl } from "@/lib/utils";

interface RawMessage {
  _id: string;
  sender: string | { _id: string; name: string; avatar?: string };
  text?: string;
  timestamp: string;
  status: Message["status"];
  type: Message["type"];
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  location?: Message["location"];
  contact?: Message["contact"];
  isForwarded?: boolean;
  reactions?: Array<{
    userId: string;
    emoji: string;
  }>;
  replyTo?: {
    _id: string;
    text?: string;
    sender?: {
      name: string;
    };
  };
}

export function useChatMessages(chatId: string) {
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const { token, user } = useSelector((state: RootState) => state.auth);

  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchMessages = async () => {
      // Wait until we have a valid chat, token, and current user id to avoid wrong isMe computation
      if (!chatId || chatId === "undefined" || chatId === "null" || !token || !user?.id) return;
      setIsLoading(true);
      setLocalMessages([]); // Clear messages when switching chats
      try {
        const response = await fetch(`/api/chats/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const resData = await response.json();
          const data = resData.payload?.messages || resData.payload || resData; // Support both formats
          console.log("Raw messages from API:", data);
          
          // Format messages for UI
          const formattedMessages = data.map((msg: RawMessage) => {
            type SenderObj = { _id?: string; id?: string; name?: string; avatar?: string };
            const sObj: SenderObj | undefined =
              typeof msg.sender === "object" ? (msg.sender as SenderObj) : undefined;
            const senderId =
              sObj?._id?.toString?.() ||
              sObj?.id?.toString?.() ||
              (typeof msg.sender === "string" ? msg.sender.toString() : undefined);
            const senderName = sObj?.name;
            const senderAvatar = sObj?.avatar;
            return {
              id: msg._id,
              senderId,
              senderName,
              senderAvatar,
              text: msg.text,
              timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: formatDate(new Date(msg.timestamp)),
              status: msg.status,
              isMe: senderId?.toString() === user?.id?.toString(),
              type: msg.type,
              mediaUrl: msg.mediaUrl,
              fileName: msg.fileName || (msg.type === 'file' || msg.type === 'image' ? getFileNameFromUrl(msg.mediaUrl) : undefined),
              fileSize: msg.fileSize ? formatFileSize(msg.fileSize) : undefined,
              location: msg.location,
              contact: msg.contact,
              isForwarded: msg.isForwarded,
              reactions: msg.reactions?.reduce((acc: NonNullable<Message["reactions"]>, curr) => {
                const existing = acc.find(r => r.emoji === curr.emoji);
                if (existing) {
                  existing.count++;
                  if (curr.userId?.toString() === user?.id) existing.me = true;
                } else {
                  acc.push({
                    emoji: curr.emoji,
                    count: 1,
                    me: curr.userId?.toString() === user?.id
                  });
                }
                return acc;
              }, []) || [],
              replyTo: msg.replyTo ? {
                id: msg.replyTo._id,
                text: msg.replyTo.text,
                senderName: msg.replyTo.sender?.name || "User"
              } : undefined
            };
          });
          console.log("Formatted messages for UI:", formattedMessages);
          setLocalMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, token, user?.id]);

  function formatDate(date: Date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const filteredMessages = useMemo(() => {
    return searchQuery.trim()
      ? localMessages.filter((msg) =>
          msg.text?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : localMessages;
  }, [localMessages, searchQuery]);

  const groupedMessages = useMemo(() => {
    return localMessages.reduce((groups: Record<string, Message[]>, msg) => {
      const date = msg.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
      return groups;
    }, {});
  }, [localMessages]);

  const scrollToMessage = (messageId: string) => {
    const element = messageRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedMessageId(messageId);
      setTimeout(() => setHighlightedMessageId(null), 2000);
    }
  };

  const navigateSearch = (direction: "up" | "down") => {
    if (filteredMessages.length === 0) return;
    let nextIndex = searchIndex;
    if (direction === "up") {
      nextIndex = searchIndex > 0 ? searchIndex - 1 : filteredMessages.length - 1;
    } else {
      nextIndex = searchIndex < filteredMessages.length - 1 ? searchIndex + 1 : 0;
    }
    setSearchIndex(nextIndex);
    scrollToMessage(filteredMessages[nextIndex].id);
  };

  const loadMoreMessages = () => {
    setIsPaginationLoading(true);
    setTimeout(() => {
      setIsPaginationLoading(false);
    }, 1500);
  };

  return {
    localMessages,
    setLocalMessages,
    filteredMessages,
    groupedMessages,
    isLoading,
    isPaginationLoading,
    searchQuery,
    setSearchQuery,
    searchIndex,
    setSearchIndex,
    highlightedMessageId,
    messageRefs,
    scrollToMessage,
    navigateSearch,
    loadMoreMessages,
  };
}
