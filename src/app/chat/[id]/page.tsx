"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useMemo, Suspense } from "react";
import { setActiveChat } from "@/store/slices/chatSlice";
import { Lightbox } from "@/components/chat/Lightbox";
import { ContextMenu } from "@/components/chat/ContextMenu";
import { socketService } from "@/lib/socket/socket-client";
import { MessageInput } from "@/components/chat/MessageInput";
import { ChatInfoPanel } from "@/components/chat/ChatInfoPanel";
import { ForwardModal } from "@/components/chat/ForwardModal";
import { ContactPickerModal } from "@/components/chat/input/ContactPickerModal";
import { AnimatePresence } from "framer-motion";
import { ChatHeader } from "@/components/chat-page/ChatHeader";
import { ChatSearch } from "@/components/chat-page/ChatSearch";
import { PinnedMessagesBar } from "@/components/chat-page/PinnedMessagesBar";
import { MessageList } from "@/components/chat-page/MessageList";
import { ScrollToBottomButton } from "@/components/chat-page/ScrollToBottomButton";
import { EmojiPicker } from "@/components/chat-page/EmojiPicker";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatInteractions } from "@/hooks/useChatInteractions";
import { useChatState } from "@/hooks/useChatState";
import mongoose from "mongoose";

function ChatContent() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // normalize id parameter; avoid passing literal "undefined" into hooks
  const chatId = typeof id === "string" && id !== "undefined" && id !== "null" ? id : "";
  const searchParams = useSearchParams();
  const msgId = searchParams.get("msgId");
  const { chats } = useSelector((state: RootState) => state.chat);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const chat = useMemo(() => chats.find((c) => c.id === id), [chats, id]);

  useEffect(() => {
    if (id) {
      dispatch(setActiveChat(id as string));
    }
    return () => {
      dispatch(setActiveChat(null));
    };
  }, [id, dispatch]);

  const {
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
  } = useChatMessages(chatId);

  // if chatId is missing, show a placeholder briefly then bounce back to main screen
  const router = useRouter();
  useEffect(() => {
    if (!chatId) {
      // push back to root after render to avoid flicker
      router.replace("/");
    }
  }, [chatId, router]);


  const {
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
    handleDeleteMessage,
  } = useChatInteractions(chatId);

  // Sync pinned messages when localMessages or chat changes
  useEffect(() => {
    if (chat?.pinnedMessageIds && localMessages.length > 0) {
      const pinnedIds = new Set(chat.pinnedMessageIds);
      const pinned = localMessages.filter((m) => pinnedIds.has(m.id));
      setPinnedMessages(pinned);
    }
  }, [chat?.pinnedMessageIds, localMessages, setPinnedMessages]);

  const {
    inputValue,
    setInputValue,
    showScrollToBottom,
    unreadCount,
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
  } = useChatState(chat, setLocalMessages, setReplyingTo, replyingTo);

  useEffect(() => {
    if (msgId && !isLoading) {
      scrollToMessage(msgId);
    }
  }, [msgId, isLoading]);

  const handleForward = async (chatIds: string[]) => {
    if (!forwardingMessage || !token) return;

    try {
      await Promise.all(
        chatIds.map(async (chatId) => {
          const response = await fetch("/api/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              chatId,
              text: forwardingMessage.text,
              type: forwardingMessage.type || "text",
              mediaUrl: forwardingMessage.mediaUrl,
              fileName: forwardingMessage.fileName,
              fileSize: forwardingMessage.fileSize,
              duration: forwardingMessage.duration,
              location: forwardingMessage.location,
              contact: forwardingMessage.contact,
              isForwarded: true,
            }),
          });

          if (response.ok) {
            const savedMsg = await response.json();
            const targetChat = chats.find((c) => c.id === chatId);

            const finalMessage = {
              id: savedMsg._id,
              senderId: user?.id,
              senderName: user?.name,
              text: savedMsg.text,
              timestamp: new Date(savedMsg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              date: "Today",
              status: "sent",
              isMe: true,
              type: savedMsg.type,
              mediaUrl: savedMsg.mediaUrl,
              fileName: savedMsg.fileName,
              fileSize: savedMsg.fileSize,
              duration: savedMsg.duration,
              location: savedMsg.location,
              contact: savedMsg.contact,
              isForwarded: true,
            };

            // Emit to socket server for real-time delivery
            const receiverId =
              targetChat?.type === "private" &&
              Array.isArray(targetChat.members)
                ? targetChat.members.find(
                    (p: { _id?: mongoose.Types.ObjectId | string; id?: string } | string) =>
                      (typeof p === "string" ? p : (p._id?.toString() || p.id?.toString() || "")) !== user?.id,
                  )?.id ||
                  targetChat.members.find(
                    (p: { _id?: mongoose.Types.ObjectId | string; id?: string }) =>
                      (p._id?.toString() || p.id?.toString() || p) !== user?.id,
                  )?.id
                : undefined;

            socketService.emit("send_message", {
              chatId,
              message: finalMessage,
              receiverId,
            });
          }
        }),
      );
      setForwardingMessage(null);
    } catch (error) {
      console.error("Failed to forward message:", error);
    }
  };

  const handleDelete = async (message: { id?: string; _id?: string }) => {
    const messageId = message.id || message._id;
    if (!messageId) return;
    
    await handleDeleteMessage(messageId, () => {
      setLocalMessages((prev) => prev.filter((m) => m.id !== messageId));
      setContextMenu(null);
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Chat not found
      </div>
    );
  }

  const starredMessages = localMessages.filter((m) =>
    starredMessageIds.has(m.id),
  );

  const handleReaction = async (message: { id: string; reactions?: { emoji: string; count: number; me?: boolean }[] }, emoji: string) => {
    if (!chat || !id || !token) return;

    // Optimistic Update
    setLocalMessages((prev) =>
      prev.map((m) => {
        if (m.id === message.id) {
          const reactions = [...(m.reactions || [])];
          const existingIdx = reactions.findIndex((r) => r.emoji === emoji);

          if (existingIdx > -1) {
            const reaction = { ...reactions[existingIdx] };
            if (reaction.me) {
              // Remove my reaction
              if (reaction.count > 1) {
                reactions[existingIdx] = {
                  ...reaction,
                  count: reaction.count - 1,
                  me: false,
                };
              } else {
                reactions.splice(existingIdx, 1);
              }
            } else {
              // Add my reaction to existing
              reactions[existingIdx] = {
                ...reaction,
                count: reaction.count + 1,
                me: true,
              };
            }
          } else {
            // New emoji reaction
            reactions.push({ emoji, count: 1, me: true });
          }
          return { ...m, reactions };
        }
        return m;
      }),
    );

    try {
      const response = await fetch("/api/messages/react", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messageId: message.id, emoji }),
      });

      if (response.ok) {
        const updatedMsg = await response.json();
        const reactions =
          updatedMsg?.payload?.reactions || updatedMsg?.reactions;
        if (reactions) {
          socketService.emit("message_reaction", {
            chatId: id,
            messageId: message.id,
            reactions,
            userId: user?.id,
          });
        }
      }
    } catch (error) {
      console.error("Failed to react:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] dark:bg-gray-950 relative overflow-hidden">
      <ChatHeader
        chat={{ ...chat, themeColor: chatThemeColor }}
        isOnline={isOnline}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        setShowInfo={setShowInfo}
      />

      <PinnedMessagesBar
        pinnedMessages={pinnedMessages}
        currentPinnedIndex={currentPinnedIndex}
        onNavigate={() => {
          const msg = pinnedMessages[currentPinnedIndex];
          scrollToMessage(msg.id);
          setCurrentPinnedIndex((prev) => (prev + 1) % pinnedMessages.length);
        }}
        onClear={() => setPinnedMessages([])}
      />

      <ChatSearch
        isOpen={isSearchOpen}
        query={searchQuery}
        setQuery={(q) => {
          setSearchQuery(q);
          setSearchIndex(0);
        }}
        filteredCount={filteredMessages.length}
        currentIndex={searchIndex}
        onNavigate={navigateSearch}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery("");
          setSearchIndex(0);
        }}
      />

      <MessageList
        scrollContainerRef={scrollContainerRef}
        onScroll={() =>
          handleScroll(isPaginationLoading, isLoading, loadMoreMessages)
        }
        chatWallpaper={chatWallpaper}
        themeColor={chatThemeColor}
        isPaginationLoading={isPaginationLoading}
        isLoading={isLoading}
        localMessages={localMessages}
        groupedMessages={groupedMessages}
        messageRefs={messageRefs}
        highlightedMessageId={highlightedMessageId}
        starredMessageIds={starredMessageIds}
        pinnedMessages={pinnedMessages}
        searchQuery={searchQuery}
        chatType={chat.type}
        chatId={chat.id}
        onImageClick={setLightboxUrl}
        onReply={setReplyingTo}
        onForward={setForwardingMessage}
        onLike={(message) => handleReaction(message, "❤️")}
        onReaction={handleReaction}
        onContextMenu={(e, message) => {
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            message,
          });
        }}
        messagesEndRef={messagesEndRef}
        isTyping={isTyping}
        typingUser={typingUser}
        fontSize={user?.settings?.fontSize}
        bubbleStyle={user?.settings?.bubbleStyle}
        accentColor={user?.settings?.accentColor}
      />

      <ScrollToBottomButton
        isVisible={showScrollToBottom}
        unreadCount={unreadCount}
        onClick={scrollToBottom}
      />

      <EmojiPicker
        isOpen={showEmojiPicker}
        onSelect={(emoji) => {
          setInputValue((prev) => prev + emoji);
          setShowEmojiPicker(false);
        }}
      />

      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSendMessage={handleSendMessage}
        onSendMedia={handleSendMedia}
          onSendVoice={handleSendMedia}
          onSendLocation={handleSendLocation}
          onSendContact={() => setIsContactPickerOpen(true)}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        themeColor={chatThemeColor}
      />

      <ContactPickerModal
        isOpen={isContactPickerOpen}
        onClose={() => setIsContactPickerOpen(false)}
        onSelect={handleSendContact}
      />

      <Lightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />

      <AnimatePresence>
        {forwardingMessage && (
          <ForwardModal
            message={forwardingMessage}
            onClose={() => setForwardingMessage(null)}
            onForward={handleForward}
          />
        )}
      </AnimatePresence>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isPinned={
            !!pinnedMessages.find((m) => m.id === contextMenu.message.id)
          }
          isStarred={starredMessageIds.has(contextMenu.message.id)}
          onClose={() => setContextMenu(null)}
          onReply={() => setReplyingTo(contextMenu.message)}
          onForward={() => setForwardingMessage(contextMenu.message)}
          onPin={() => handlePinMessage(contextMenu.message)}
          onStar={() => handleStarMessage(contextMenu.message)}
          onDelete={() => handleDelete(contextMenu.message)}
          onCopy={() => {
            navigator.clipboard.writeText(contextMenu.message.text || "");
          }}
          onReact={(emoji) => {
            handleReaction(contextMenu.message, emoji);
            setContextMenu(null);
          }}
        />
      )}

      <AnimatePresence>
        {showInfo && (
          <ChatInfoPanel
            chat={{ ...chat, wallpaper: chatWallpaper, themeColor: chatThemeColor }}
            messages={localMessages}
            onClose={() => setShowInfo(false)}
            onWallpaperChange={setChatWallpaper}
            onThemeChange={setChatThemeColor}
            starredMessages={starredMessages}
            onMessageClick={(msgId) => {
              scrollToMessage(msgId);
              setShowInfo(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
