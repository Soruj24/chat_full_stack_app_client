"use client";

import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setChats, updateChat, removeChat } from "@/store/slices/chatSlice";
import { IChat as Chat, User, Message } from "@/lib/types";

export function useSidebar(searchQuery: string, filter: string) {
  const { chats } = useSelector((state: RootState) => state.chat);
  const { token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // Global Socket Listener for new messages is now handled in Providers.tsx
  // This hook now only focuses on filtering and managing the UI state of the sidebar

  // Local state for search results
  const [globalUsers, setGlobalUsers] = useState<User[]>([]);
  const [globalMessages, setGlobalMessages] = useState<
    {
      chatId: string;
      message: Message;
    }[]
  >([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingChats, setLoadingChats] = useState<boolean>(true);

  // Fetch all users on mount
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!token || !user) return;
      try {
        const response = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const resData = await response.json();
          const data = resData.payload?.users || resData.payload || resData;
          const usersArr = Array.isArray(data) ? data : (data?.users || []);
          setAllUsers(
            usersArr.map(
              (
                u: {
                  id?: string;
                  _id?: string;
                  name?: string;
                  username?: string;
                  avatar?: string;
                  status?: string;
                },
                index: number,
              ) => ({
                id: u._id || u.id || `user-${index}`,
                name: u.username || u.name || "",
                username: u.username,
                avatar: u.avatar || "",
                status: u.status || "offline",
              }),
            ),
          );
        }
      } catch (error) {
        console.error("Failed to fetch all users:", error);
      }
    };
    fetchAllUsers();
  }, [token, user?.id]);

  // Fetch chats from API
  useEffect(() => {
    const fetchChats = async () => {
      if (!token || !user) return;
      setLoadingChats(true);
      try {
        const response = await fetch("/api/chats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const resData = await response.json();
          const data = resData.payload || resData; // Support both formats
          // Map MongoDB data to frontend type if needed
          const mappedChats = data.map(
            (
              chat: {
                id?: string;
                _id?: string;
                type?: string;
                name?: string;
                avatar?: string;
                participants?: {
                  id?: string;
                  _id?: string;
                  name?: string;
                  avatar?: string;
                  username?: string;
                  status?: string;
                }[];
                lastMessage?: {
                  text?: string;
                  timestamp?: string;
                  status?: string;
                  sender?: {
                    id?: string;
                    _id?: string;
                  };
                };
                unreadCount?: number;
                isPinned?: boolean;
                isArchived?: boolean;
                isMuted?: boolean;
                pinnedMessageIds?: string[];
                wallpaper?: string;
                themeColor?: string;
              },
              index: number,
            ) => {
              if (!chat.participants) return null;
              const otherParticipant = chat.participants.find(
                (p: { _id?: string; id?: string }) =>
                  (p._id?.toString() || p.id?.toString()) !== user.id,
              );
              return {
                id: chat._id || chat.id || `chat-${index}`,
                otherParticipantId:
                  chat.type === "private"
                    ? otherParticipant?._id?.toString() ||
                      otherParticipant?.id?.toString()
                    : undefined,
                name:
                  chat.type === "private"
                    ? otherParticipant?.username || otherParticipant?.name || "Chat"
                    : chat.name,
                avatar:
                  chat.type === "private"
                    ? otherParticipant?.avatar
                    : chat.avatar,
                type: chat.type,
                members: chat.participants.map(
                  (p: {
                    id?: string;
                    _id?: string;
                    name?: string;
                    avatar?: string;
                    username?: string;
                    status?: string;
                  }) => ({
                    id: p._id?.toString() || p.id?.toString(),
                    name: p.username || p.name || "",
                    avatar: p.avatar,
                    username: p.username,
                    status: p.status || "offline",
                  }),
                ),
                lastMessage: chat.lastMessage
                  ? {
                      text: chat.lastMessage.text,
                      time: new Date(
                        chat.lastMessage.timestamp || "",
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      status: chat.lastMessage.status,
                      senderId:
                        typeof chat.lastMessage.sender === "object"
                          ? chat.lastMessage.sender._id
                          : chat.lastMessage.sender,
                    }
                  : undefined,
                unreadCount: chat.unreadCount || 0,
                isPinned: chat.isPinned || false,
                isArchived: chat.isArchived || false,
                isMuted: chat.isMuted || false,
                pinnedMessageIds: chat.pinnedMessageIds || [],
                wallpaper: chat.wallpaper,
                themeColor: chat.themeColor,
              };
            },
          );
          dispatch(setChats(mappedChats.filter(Boolean)));
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChats();
  }, [token, user?.id, dispatch]);

  // Fetch users and messages when searching
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim() || !token) {
        setGlobalUsers([]);
        setGlobalMessages([]);
        return;
      }
      try {
        // Search Users
        const usersResponse = await fetch(
          `/api/users?q=${encodeURIComponent(searchQuery)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (usersResponse.ok) {
          const resData = await usersResponse.json();
          const data = resData.payload?.users || resData.payload || resData;
          const usersArr = Array.isArray(data) ? data : (data?.users || []);
          setGlobalUsers(
            usersArr.map(
              (
                u: {
                  _id?: string;
                  id?: string;
                  name?: string;
                  username?: string;
                  avatar?: string;
                  status?: string;
                },
                index: number,
              ) => ({
                id: u._id || u.id || `search-user-${index}`,
                name: u.username || u.name || "",
                username: u.username,
                avatar: u.avatar || "",
                status: u.status || "offline",
              }),
            ),
          );
        }

        // Search Messages
        const messagesResponse = await fetch(
          `/api/messages/search?q=${encodeURIComponent(searchQuery)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (messagesResponse.ok) {
          const data = await messagesResponse.json();
          setGlobalMessages(
            data.map(
              (
                item: {
                  chatId?: string;
                  chat?: { _id?: string; id?: string };
                  message?: Message;
                  _id?: string;
                  id?: string;
                  sender?: string | { _id?: string; id?: string };
                  timestamp?: string;
                  status?: string;
                  type?: string;
                },
                index: number,
              ) => ({
                chatId: item.chatId || item.chat?._id || item.chat?.id || "",
                message: {
                  ...(item.message || item),
                  id: (
                    item.message?._id ||
                    item.message?.id ||
                    item._id ||
                    item.id ||
                    `msg-${index}`
                  ).toString(),
                  senderId: (
                    (typeof item.message?.sender === "object"
                      ? item.message?.sender?._id || item.message?.sender?.id
                      : null) ||
                    (typeof item.sender === "object"
                      ? item.sender?._id || item.sender?.id
                      : null) ||
                    item.sender ||
                    ""
                  ).toString(),
                  timestamp:
                    item.message?.timestamp ||
                    item.timestamp ||
                    new Date().toISOString(),
                  status: item.message?.status || item.status || "sent",
                  type: item.message?.type || item.type || "text",
                  isMe:
                    ((typeof item.message?.sender === "object"
                      ? item.message?.sender?._id || item.message?.sender?.id
                      : null) ||
                      (typeof item.sender === "object"
                        ? item.sender?._id || item.sender?.id
                        : null) ||
                      item.sender) === user?.id,
                },
              }),
            ),
          );
        }
      } catch (error) {
        console.error("Failed to perform search:", error);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, token]);

  const handleTogglePin = async (id: string) => {
    try {
      const response = await fetch(`/api/chats/${id}/pin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(
          updateChat({ chatId: id, updates: { isPinned: data.isPinned } }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const handleToggleArchive = async (id: string) => {
    try {
      const response = await fetch(`/api/chats/${id}/archive`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(
          updateChat({ chatId: id, updates: { isArchived: data.isArchived } }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle archive:", error);
    }
  };

  const handleToggleMute = async (id: string) => {
    try {
      const response = await fetch(`/api/chats/${id}/mute`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(
          updateChat({ chatId: id, updates: { isMuted: data.isMuted } }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle mute:", error);
    }
  };

  const handleDeleteChat = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      const response = await fetch(`/api/chats/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        dispatch(removeChat(id));
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  // Global Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { chats: [], messages: [], users: [] };

    const query = searchQuery.toLowerCase();

    // 1. Search Chats
    const matchedChats = chats.filter(
      (c) =>
        c.name?.toLowerCase().includes(query) ||
        c.lastMessage?.text?.toLowerCase().includes(query),
    );

    // 2. Search Messages globally
    const matchedMessages = globalMessages;

    // 3. Search Users (not in current chats)
    // Map current chat participants to their IDs
    const existingChatUserIds = new Set(
      chats
        .filter((c) => c.type === "private" && c.otherParticipantId)
        .map((c) => c.otherParticipantId),
    );

    const matchedUsers = globalUsers.filter(
      (user) => !existingChatUserIds.has(user.id),
    );

    return {
      chats: matchedChats,
      messages: matchedMessages.slice(0, 10),
      users: matchedUsers.slice(0, 10),
    };
  }, [searchQuery, chats, globalUsers, globalMessages]);

  const filteredChats = chats.filter((chat) => {
    // If searching, only filter by search query, ignore category filters for results
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesName = chat.name?.toLowerCase().includes(query);
      const matchesMessage = chat.lastMessage?.text
        ?.toLowerCase()
        .includes(query);
      return matchesName || matchesMessage;
    }

    // Category Filter Logic (only when not searching)
    if (filter === "unread")
      return (chat.unreadCount || 0) > 0 && !chat.isArchived;
    if (filter === "groups") return chat.type === "group" && !chat.isArchived;
    if (filter === "archived") return chat.isArchived;

    // Default ("all"): don't show archived chats
    return !chat.isArchived;
  });

  const pinnedChats = useMemo(
    () => filteredChats.filter((c) => c.isPinned && filter !== "archived"),
    [filteredChats, filter],
  );

  const otherChats = useMemo(
    () => filteredChats.filter((c) => !c.isPinned || filter === "archived"),
    [filteredChats, filter],
  );

  const displayUsers = useMemo(() => {
    const existingChatUserIds = new Set(
      chats
        .filter((c) => c.type === "private" && c.otherParticipantId)
        .map((c) => c.otherParticipantId),
    );
    return allUsers.filter((user) => !existingChatUserIds.has(user.id));
  }, [allUsers, chats]);

  return {
    searchResults,
    allUsers: displayUsers,
    pinnedChats,
    otherChats,
    loadingChats,
    handleTogglePin,
    handleToggleArchive,
    handleToggleMute,
    handleDeleteChat,
  };
}
