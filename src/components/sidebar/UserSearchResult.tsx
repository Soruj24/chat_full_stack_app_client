"use client";

import Image from "next/image";
import { MessageSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addChat, setActiveChat } from "@/store/slices/chatSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { User as UserType } from "@/lib/types";

interface UserSearchResultProps {
  user: UserType;
}

export function UserSearchResult({ user }: UserSearchResultProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user: currentUser } = useSelector(
    (state: RootState) => state.auth,
  );
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    if (!token || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          participantId: user.id,
          type: "private",
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        const chatData = resData.payload || resData;

        // Find other participant to get the correct name/avatar
        type Participant = string | { _id?: string; id?: string; name?: string; avatar?: string };
        const participants: Participant[] = Array.isArray(chatData.participants) ? chatData.participants : [];
        const getId = (p: Participant): string | undefined =>
          typeof p === "string" ? p : p._id || p.id;
        const otherParticipant = participants.find((p) => getId(p) !== currentUser?.id);

        const mappedChat = {
          id: chatData.id,
          name: (typeof otherParticipant === "object" ? otherParticipant?.name : undefined) || chatData.name || user.name,
          avatar: (typeof otherParticipant === "object" ? otherParticipant?.avatar : undefined) || chatData.avatar || user.avatar,
          type: chatData.type,
          lastMessage: chatData.lastMessage,
          unreadCount: 0,
          otherParticipantId:
            typeof otherParticipant === "object" ? (otherParticipant._id || otherParticipant.id) : undefined,
        };

        // Add to local chats if not already there and set active
        dispatch(addChat(mappedChat));
        dispatch(setActiveChat(mappedChat.id));
        if (mappedChat.id) {
          router.push(`/chat/${mappedChat.id}`);
        } else {
          console.warn("Attempted to navigate to chat with missing id", mappedChat);
        }
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
    } finally {
      setLoading(false);
    }
  };

  // Safely check if avatar exists and is a non-empty string
  const getAvatarSrc = () => {
    // Check if avatar exists and is a string with content
    if (user.avatar && typeof user.avatar === 'string' && user.avatar.trim() !== '') {
      return user.avatar;
    }
    // Fallback to UI Avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}`;
  };

  return (
    <div
      onClick={handleStartChat}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
    >
      <div className="relative w-10 h-10 shrink-0">
        <Image
          src={getAvatarSrc()}
          alt={user.name || "User avatar"}
          fill
          unoptimized
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
            {user.name}
          </h4>
          <MessageSquare className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-xs text-gray-500 truncate">@{user.username}</p>
      </div>
    </div>
  );
}