"use client";

import { useState, useRef, useEffect } from "react";
import { IChat, Message } from "@/lib/types";
import { socketService } from "@/lib/socket/socket-client";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  markAsRead,
  setActiveChat,
  updateChat,
  removeMessage,
} from "@/store/slices/chatSlice";
import { RootState } from "@/store/store";

export function useChatState(
  chat: IChat | undefined,
  setLocalMessages: (fn: (prev: Message[]) => Message[]) => void,
  setReplyingTo: (msg: Message | null) => void,
  replyingTo: Message | null,
) {
  const [inputValue, setInputValue] = useState("");
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [isContactPickerOpen, setIsContactPickerOpen] = useState(false);
  const [chatWallpaper, setChatWallpaper] = useState<string | undefined>(
    chat?.wallpaper,
  );
  const [chatThemeColor, setChatThemeColor] = useState<string | undefined>(
    chat?.themeColor,
  );
  const dispatch = useDispatch();

  // Sync wallpaper and theme color when chat object changes
  useEffect(() => {
    setChatWallpaper(chat?.wallpaper);
    setChatThemeColor(chat?.themeColor);
  }, [chat?.wallpaper, chat?.themeColor]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!chat?.id || !user?.id) return;
    const currentChatId = chat.id;

    // Mark as read and set as active chat when entering
    dispatch(markAsRead(currentChatId));
    dispatch(setActiveChat(currentChatId));

    // Notify socket that we've read messages in this chat
    socketService.emit("read_messages", {
      chatId: currentChatId,
      userId: user.id,
    });

    socketService.connect();

    // Join user room and specific chat room
    socketService.emit("join", user.id);
    socketService.emit("join_chat", currentChatId);

    const handleReceiveMessage = (message: Message) => {
      // If the message belongs to this chat and it's not from me
      if (message.senderId !== user.id) {
        // Handle notifications and sounds based on user settings
        if (user?.settings?.showNotifications) {
          if (Notification.permission === "granted") {
            new Notification(message.senderName || "New Message", {
              body: user.settings.messagePreview
                ? message.text
                : "You have a new message",
              icon: "/favicon.ico",
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission();
          }
        }

        if (user?.settings?.soundEffects) {
          const audio = new Audio("/sounds/notification.mp3");
          audio
            .play()
            .catch((e) => console.log("Audio play blocked by browser"));
        }

        setLocalMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, { ...message, isMe: false }];
        });
        dispatch(
          addMessage({
            chatId: currentChatId,
            message: { ...message, isMe: false },
          }),
        );

        // Handle unread count and scrolling
        if (scrollContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } =
            scrollContainerRef.current;
          const isAtBottom = scrollHeight - scrollTop - clientHeight < 150; // threshold

          if (isAtBottom) {
            setTimeout(scrollToBottom, 100);
          } else {
            setUnreadCount((prev) => prev + 1);
          }
        }
      }
    };

    const handleTyping = ({
      chatId: typingChatId,
      userId: typingUserId,
      isTyping: typingStatus,
    }: {
      chatId: string;
      userId: string;
      isTyping: boolean;
    }) => {
      if (typingChatId === currentChatId && typingUserId !== user.id) {
        setIsTyping(typingStatus);
        setIsOnline(true);

        if (typingStatus) {
          // If it's a private chat, we know the name
          if (chat.type === "private") {
            setTypingUser(chat.name || "Someone");
          } else {
            // In a group, try to find the user name from members
            const member = chat.members?.find(
              (m: { id?: string; _id?: string }) =>
                (m.id || m._id || m).toString() === typingUserId,
            );
            setTypingUser(member?.name || "Someone");
          }
        }
      }
    };

    socketService.on("receive_message", handleReceiveMessage);
    socketService.on("user_typing", handleTyping);

    const handleMessageReaction = ({
      messageId,
      reactions,
      userId: reactionUserId,
    }: {
      messageId: string;
      reactions: { emoji: string; userId?: string }[];
      userId: string;
    }) => {
      setLocalMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            const formattedReactions = reactions.reduce(
              (
                acc: { emoji: string; count: number; me: boolean }[],
                curr: { emoji: string; userId?: string },
              ) => {
                const existing = acc.find((r) => r.emoji === curr.emoji);
                if (existing) {
                  existing.count++;
                  if (curr.userId?.toString() === user?.id) existing.me = true;
                } else {
                  acc.push({
                    emoji: curr.emoji,
                    count: 1,
                    me: curr.userId?.toString() === user?.id,
                  });
                }
                return acc;
              },
              [],
            );
            return { ...m, reactions: formattedReactions };
          }
          return m;
        }),
      );
    };

    socketService.on("message_reaction", handleMessageReaction);

    const handleNewMessageNotification = ({
      chatId: notifChatId,
      message,
    }: {
      chatId: string;
      message: Message;
    }) => {
      if (notifChatId === currentChatId && message.senderId !== user.id) {
        setLocalMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, { ...message, isMe: false }];
        });
      }
    };

    socketService.on("new_message_notification", handleNewMessageNotification);
    const handleMessagePin = ({
      messageId,
      isPinned,
    }: {
      messageId: string;
      isPinned: boolean;
    }) => {
      // Update chat in Redux
      const newPinnedMessages = isPinned
        ? [...(chat.pinnedMessageIds || []), messageId]
        : (chat.pinnedMessageIds || []).filter(
            (id: string) => id.toString() !== messageId,
          );

      dispatch(
        updateChat({
          chatId: currentChatId,
          updates: { pinnedMessageIds: newPinnedMessages },
        }),
      );
    };

    const handleMessageDelete = ({
      chatId,
      messageId,
    }: {
      chatId: string;
      messageId: string;
    }) => {
      if (chatId === chat?.id) {
        setLocalMessages((prev) => prev.filter((m) => m.id !== messageId));
        // removeMessage is not imported/defined; just update local state
        // dispatch(removeMessage({ chatId, messageId }));
      }
    };

    socketService.on("message_pin", handleMessagePin);
    socketService.on("message_delete", handleMessageDelete);

    const handleMessageStatusUpdate = ({
      chatId: statusChatId,
      messageId,
      status,
    }: {
      chatId: string;
      messageId: string;
      status: Message["status"];
    }) => {
      if (statusChatId === currentChatId) {
        setLocalMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, status } : m)),
        );
      }
    };

    const handleMessagesRead = ({
      chatId: readChatId,
      userId: readerUserId,
    }: {
      chatId: string;
      userId: string;
    }) => {
      if (readChatId === currentChatId && readerUserId !== user.id) {
        setLocalMessages((prev) =>
          prev.map((m) =>
            m.senderId === user.id ? { ...m, status: "read" } : m,
          ),
        );
      }
    };

    socketService.on("message_status_update", handleMessageStatusUpdate);
    socketService.on("messages_read", handleMessagesRead);

    socketService.on(
      "user_status_update",
      ({ userId: statusUserId, status }) => {
        if (
          (chat.type === "private" || chat.type === "individual") &&
          Array.isArray(chat.members) &&
          chat.members.some(
            (m: { id?: string; _id?: string }) =>
              (m.id || m._id || m).toString() === statusUserId,
          ) &&
          statusUserId !== user.id
        ) {
          setIsOnline(status === "online");
        }
      },
    );

    return () => {
      socketService.emit("leave_chat", currentChatId);
      socketService.off("receive_message", handleReceiveMessage);
      socketService.off("user_typing", handleTyping);
      socketService.off("message_reaction", handleMessageReaction);
      socketService.off(
        "new_message_notification",
        handleNewMessageNotification,
      );
      socketService.off("message_pin", handleMessagePin);
      socketService.off("message_delete", handleMessageDelete);
      socketService.off("message_status_update", handleMessageStatusUpdate);
      socketService.off("messages_read", handleMessagesRead);
      socketService.off("user_status_update");
      dispatch(setActiveChat(null));
    };
  }, [chat?.id, user?.id, dispatch, setLocalMessages]);

  useEffect(() => {
    if (!chat?.id || !user?.id) return;
    const currentChatId = chat.id;

    if (inputValue.trim()) {
      socketService.emit("typing", {
        chatId: currentChatId,
        userId: user.id,
        isTyping: true,
      });
    } else {
      socketService.emit("typing", {
        chatId: currentChatId,
        userId: user.id,
        isTyping: false,
      });
    }

    const timer = setTimeout(() => {
      socketService.emit("typing", {
        chatId: currentChatId,
        userId: user.id,
        isTyping: false,
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
      socketService.emit("typing", {
        chatId: currentChatId,
        userId: user.id,
        isTyping: false,
      });
    };
  }, [inputValue, chat?.id, user?.id]);

  useEffect(() => {
    if (
      chatWallpaper !== undefined &&
      chatWallpaper !== chat?.wallpaper &&
      chat?.id &&
      token
    ) {
      const updateWallpaper = async () => {
        try {
          const response = await fetch(`/api/chats/${chat.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ wallpaper: chatWallpaper }),
          });

          if (response.ok) {
            dispatch(
              updateChat({
                chatId: chat.id,
                updates: { wallpaper: chatWallpaper },
              }),
            );
          }
        } catch (error) {
          console.error("Failed to update wallpaper:", error);
        }
      };

      const timer = setTimeout(updateWallpaper, 500); // Debounce
      return () => clearTimeout(timer);
    }
  }, [chatWallpaper, chat?.id, token, dispatch, chat?.wallpaper]);

  useEffect(() => {
    if (
      chatThemeColor !== undefined &&
      chatThemeColor !== chat?.themeColor &&
      chat?.id &&
      token
    ) {
      const updateThemeColor = async () => {
        try {
          const response = await fetch(`/api/chats/${chat.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ themeColor: chatThemeColor }),
          });

          if (response.ok) {
            dispatch(
              updateChat({
                chatId: chat.id,
                updates: { themeColor: chatThemeColor },
              }),
            );
          }
        } catch (error) {
          console.error("Failed to update theme color:", error);
        }
      };

      const timer = setTimeout(updateThemeColor, 500); // Debounce
      return () => clearTimeout(timer);
    }
  }, [chatThemeColor, chat?.id, token, dispatch, chat?.themeColor]);

  const handleSendMessage = async () => {
    const chatId = chat?.id;
    if (inputValue.trim() && token && chatId) {
      const tempId = Date.now().toString();
      const newMessage: Message = {
        id: tempId,
        senderId: user?.id || "me",
        text: inputValue.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: "Today",
        status: "sending",
        isMe: true,
        senderName: user?.name,
        type: "text",
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: replyingTo.text,
              senderName: replyingTo.senderName || chat?.name || "User",
            }
          : undefined,
      };

      // Optimistic update
      setLocalMessages((prev) => [...prev, newMessage]);
      setInputValue("");
      socketService.emit("typing", {
        chatId: chatId,
        userId: user?.id || "me",
        isTyping: false,
      });
      setReplyingTo(null);
      setTimeout(scrollToBottom, 100);

      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatId,
            text: newMessage.text,
            type: "text",
            replyTo: replyingTo ? replyingTo.id : undefined,
          }),
        });

        if (response.ok) {
          const savedMsg = await response.json();

          // Update local state with real ID and status
          setLocalMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? { ...msg, id: savedMsg._id, status: "sent" }
                : msg,
            ),
          );

          const finalMessage: Message = {
            ...newMessage,
            id: savedMsg._id,
            status: "sent",
          };

          // Emit to socket server for real-time delivery
          const receiverId =
            chat &&
            (chat.type === "private" || chat.type === "individual") &&
            Array.isArray(chat.members)
              ? (() => {
                  const other = chat.members.find(
                    (m: { id?: string; _id?: string } | string) => {
                      const mid =
                        typeof m === "string"
                          ? m
                          : (m._id || m.id || "").toString();
                      return mid !== (user?.id || "me");
                    },
                  );
                  if (!other) return undefined;
                  return typeof other === "string"
                    ? other
                    : other._id || other.id;
                })()
              : undefined;

          console.log("Emitting send_message:", {
            chatId,
            receiverId,
            messageId: finalMessage.id,
          });

          socketService.emit("send_message", {
            chatId,
            message: finalMessage,
            receiverId,
          });

          dispatch(addMessage({ chatId, message: finalMessage }));
        } else {
          setLocalMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId ? { ...msg, status: "error" } : msg,
            ),
          );
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, status: "error" } : msg,
          ),
        );
      }
    }
  };

  const handleSendMedia = async (file: File) => {
    const chatId = chat?.id;
    if (token && chatId) {
      const tempId = Date.now().toString();
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isVoice =
        file.type.startsWith("audio/") || file.name.endsWith(".webm");
      const duration =
        (file as File & { duration?: string }).duration || "0:00";
      const mediaUrl = URL.createObjectURL(file); // Temporary local preview

      const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
      };

      const newMessage: Message = {
        id: tempId,
        senderId: user?.id || "me",
        text: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: "Today",
        status: "sending",
        isMe: true,
        senderName: user?.name,
        type: isImage
          ? "image"
          : isVideo
            ? "video"
            : isVoice
              ? "voice"
              : "file",
        mediaUrl,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        duration: isVoice ? duration : undefined,
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: replyingTo.text,
              senderName: replyingTo.senderName || chat?.name || "User",
            }
          : undefined,
      };

      // Optimistic update
      setLocalMessages((prev) => [...prev, newMessage]);
      setReplyingTo(null);
      setTimeout(scrollToBottom, 100);

      try {
        // 1. Upload the file
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Upload failed");
        }
        const resData = await uploadResponse.json();
        const uploadData =
          resData.payload?.document || resData.payload || resData; // Support both formats
        const finalMediaUrl = uploadData.fileUrl || uploadData.url;
        const finalFileName = uploadData.fileName || file.name;
        const finalFileSize = uploadData.fileSize
          ? formatFileSize(uploadData.fileSize)
          : formatFileSize(file.size);

        // 2. Send the message with the final URL
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatId,
            text: "",
            type: isImage
              ? "image"
              : isVideo
                ? "video"
                : isVoice
                  ? "voice"
                  : "file",
            mediaUrl: finalMediaUrl,
            fileName: finalFileName,
            fileSize: finalFileSize,
            duration: isVoice ? duration : undefined,
            replyTo: replyingTo ? replyingTo.id : undefined,
          }),
        });

        if (response.ok) {
          const savedMsg = await response.json();

          // Update local state with real ID and status
          setLocalMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? {
                    ...msg,
                    id: savedMsg._id,
                    status: "sent",
                    mediaUrl: finalMediaUrl,
                    fileName: finalFileName,
                    fileSize: finalFileSize,
                  }
                : msg,
            ),
          );

          const finalMessage: Message = {
            ...newMessage,
            id: savedMsg._id,
            status: "sent",
            mediaUrl: finalMediaUrl,
            fileName: finalFileName,
            fileSize: finalFileSize,
          };

          // Emit to socket server
          const receiverId =
            chat &&
            (chat.type === "private" || chat.type === "individual") &&
            Array.isArray(chat.members)
              ? chat.members.find(
                  (m: { id?: string; _id?: string }) =>
                    (m._id || m.id || m).toString() !== (user?.id || "me"),
                )?._id ||
                chat.members.find(
                  (m: { id?: string; _id?: string }) =>
                    (m._id || m.id || m).toString() !== (user?.id || "me"),
                )?.id
              : undefined;

          socketService.emit("send_message", {
            chatId,
            message: finalMessage,
            receiverId,
          });

          dispatch(addMessage({ chatId, message: finalMessage }));
        } else {
          throw new Error("Message creation failed");
        }
      } catch (error) {
        console.error("Failed to send media:", error);
        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, status: "error" } : msg,
          ),
        );
      }
    }
  };

  const handleSendLocation = async () => {
    const chatId = chat?.id;
    if (token && chatId && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const tempId = Date.now().toString();

          // Optimistic UI update
          const newMessage: Message = {
            id: tempId,
            senderId: user?.id || "me",
            text: "",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: "Today",
            status: "sending",
            isMe: true,
            senderName: user?.name,
            type: "location",
            location: {
              latitude,
              longitude,
              address: "Fetching address...",
            },
          };

          setLocalMessages((prev) => [...prev, newMessage]);
          setTimeout(scrollToBottom, 100);

          try {
            // Get address using reverse geocoding (Nominatim)
            let address = "Unknown Location";
            try {
              const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              );
              const geoData = await geoRes.json();
              address = geoData.display_name || "Unknown Location";
            } catch (e) {
              console.error("Reverse geocoding failed:", e);
            }

            const response = await fetch("/api/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                chatId,
                type: "location",
                location: { latitude, longitude, address },
              }),
            });

            if (response.ok) {
              const savedMsg = await response.json();
              const finalMessage: Message = {
                ...newMessage,
                id: savedMsg._id,
                status: "sent",
                location: { ...newMessage.location!, address },
              };

              setLocalMessages((prev) =>
                prev.map((m) => (m.id === tempId ? finalMessage : m)),
              );

              socketService.emit("send_message", {
                chatId,
                message: finalMessage,
                receiverId:
                  chat?.type === "private"
                    ? chat.members?.find(
                        (m: { id?: string; _id?: string }) =>
                          (m._id || m.id || m) !== user?.id,
                      )?.id
                    : undefined,
              });

              dispatch(addMessage({ chatId, message: finalMessage }));
            } else {
              setLocalMessages((prev) =>
                prev.map((m) =>
                  m.id === tempId ? { ...m, status: "error" } : m,
                ),
              );
            }
          } catch (error) {
            console.error("Failed to send location:", error);
            setLocalMessages((prev) =>
              prev.map((m) =>
                m.id === tempId ? { ...m, status: "error" } : m,
              ),
            );
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Could not get your location. Please check permissions.");
        },
      );
    }
  };

  const handleSendContact = async (contact: {
    name: string;
    phoneNumber: string;
    avatar?: string;
  }) => {
    const chatId = chat?.id;
    if (token && chatId) {
      const tempId = Date.now().toString();
      const newMessage: Message = {
        id: tempId,
        senderId: user?.id || "me",
        text: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: "Today",
        status: "sending",
        isMe: true,
        senderName: user?.name,
        type: "contact",
        contact,
      };

      setLocalMessages((prev) => [...prev, newMessage]);
      setTimeout(scrollToBottom, 100);

      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatId,
            type: "contact",
            contact,
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          const savedMsg = resData.payload || resData; // Support both formats
          setLocalMessages((prev) =>
            prev.map((m) =>
              m.id === tempId
                ? {
                    ...m,
                    id: savedMsg._id || savedMsg.id,
                    status: "sent",
                  }
                : m,
            ),
          );

          // Emit socket event for real-time delivery
          socketService.emit("send_message", {
            chatId,
            message: {
              ...newMessage,
              id: savedMsg._id || savedMsg.id,
              status: "sent",
            },
            receiverId:
              chat.type === "private"
                ? (() => {
                    const other = chat.members?.find((p) => {
                      const pid =
                        typeof p === "string"
                          ? p
                          : p._id?.toString() || p.id?.toString() || "";
                      return pid !== user?.id;
                    });
                    return typeof other === "string"
                      ? other
                      : other?._id?.toString() || other?.id?.toString();
                  })()
                : undefined,
          });
        }
      } catch (error) {
        console.error("Failed to send contact:", error);
        setLocalMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "error" } : m)),
        );
      }
    }
  };

  const handleScroll = (
    isPaginationLoading: boolean,
    isLoading: boolean,
    loadMoreMessages: () => void,
  ) => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    // Show/hide scroll to bottom button
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 300;
    setShowScrollToBottom(!isAtBottom);

    if (isAtBottom) {
      setUnreadCount(0);
    }

    // Infinite scroll
    if (scrollTop < 100 && !isPaginationLoading && !isLoading) {
      loadMoreMessages();
    }
  };

  return {
    inputValue,
    setInputValue,
    showScrollToBottom,
    setShowScrollToBottom,
    unreadCount,
    setUnreadCount,
    isOnline,
    setIsOnline,
    isTyping,
    typingUser,
    isContactPickerOpen,
    setIsContactPickerOpen,
    chatWallpaper,
    setChatWallpaper,
    chatThemeColor,
    setChatThemeColor,
    messagesEndRef,
    scrollContainerRef,
    scrollToBottom,
    handleSendMessage,
    handleSendMedia,
    handleSendLocation,
    handleSendContact,
    handleScroll,
  };
}
