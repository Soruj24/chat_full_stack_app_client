"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  WifiOff,
  Search,
  Phone,
  Info,
  MoreVertical,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { initiateCall } from "@/store/slices/callSlice";

interface ChatHeaderProps {
  chat: {
    id: string;
    type: "private" | "group" | "individual";
    otherParticipantId?: string;
    name: string;
    avatar: string;
    themeColor?: string;
  };
  isOnline: boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  setShowInfo: (show: boolean) => void;
}

export function ChatHeader({
  chat,
  isOnline,
  isSearchOpen,
  setIsSearchOpen,
  setShowInfo,
}: ChatHeaderProps) {
  const dispatch = useDispatch();

  const handleCall = (type: "audio" | "video") => {
    // If it's a private chat, we call the other participant.
    // If it's a group, we might need a different logic later, but for now we focus on private.
    const receiverId =
      chat.type === "private" || chat.type === "individual"
        ? chat.otherParticipantId
        : chat.id;

    if (!receiverId) {
      console.error("No receiver ID found for call");
      return;
    }

    dispatch(
      initiateCall({
        user: {
          id: receiverId,
          name: chat.name,
          avatar: chat.avatar,
        },
        type,
      }),
    );
  };

  // Helper function to safely get avatar source
  const getAvatarSrc = () => {
    // Check if avatar exists and is a non-empty string
    if (
      chat.avatar &&
      typeof chat.avatar === "string" &&
      chat.avatar.trim() !== ""
    ) {
      return chat.avatar;
    }
    // Fallback to UI Avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name || "Chat")}`;
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-2.5 md:p-3 flex items-center justify-between z-20">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <Link
          href="/"
          className="md:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="relative w-9 h-9 md:w-10 md:h-10">
          <Image
            src={getAvatarSrc()}
            alt={chat.name}
            fill
            unoptimized
            className="rounded-full shadow-sm object-cover"
            style={
              chat.themeColor
                ? { boxShadow: `0 0 0 2px ${chat.themeColor}` }
                : {}
            }
          />
          {isOnline && (
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full z-10"
              style={
                chat.themeColor ? { backgroundColor: chat.themeColor } : {}
              }
            />
          )}
        </div>
        <div
          className="min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setShowInfo(true)}
        >
          <h2 className="font-bold text-[15px] md:text-base text-gray-900 dark:text-gray-100 truncate leading-tight">
            {chat.name}
          </h2>
          <div className="flex items-center gap-1.5">
            {chat.type === "group" ? (
              <p className="text-[11px] md:text-xs font-medium text-gray-500">
                {/* Placeholder for group member count; update when members field is added */}
              </p>
            ) : (
              <>
                {!isOnline && <WifiOff className="w-3 h-3 text-gray-400" />}
                <p
                  className={cn(
                    "text-[11px] md:text-xs font-medium",
                    isOnline ? "text-green-600" : "text-gray-500",
                  )}
                  style={
                    isOnline && chat.themeColor
                      ? { color: chat.themeColor }
                      : {}
                  }
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5 md:gap-1">
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={cn(
            "p-2 rounded-full transition-all duration-200",
            isSearchOpen
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500",
          )}
          style={
            isSearchOpen && chat.themeColor
              ? {
                  backgroundColor: `${chat.themeColor}20`,
                  color: chat.themeColor,
                }
              : {}
          }
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleCall("audio")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 text-gray-500"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleCall("video")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 text-gray-500"
        >
          <Video className="w-5 h-5" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 text-gray-500"
          onClick={() => setShowInfo(true)}
        >
          <Info className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 text-gray-500">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
