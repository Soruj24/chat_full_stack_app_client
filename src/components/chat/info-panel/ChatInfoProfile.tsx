"use client";

import Image from "next/image";
import { Phone, Video, Search } from "lucide-react";
import { IChat } from "@/lib/types";
import { useDispatch } from "react-redux";
import { initiateCall } from "@/store/slices/callSlice";

interface ChatInfoProfileProps {
  chat: IChat;
  isGroup: boolean;
  onSearchClick?: () => void;
}

export function ChatInfoProfile({
  chat,
  isGroup,
  onSearchClick,
}: ChatInfoProfileProps) {
  const dispatch = useDispatch();

  const handleCall = (type: "audio" | "video") => {
    dispatch(
      initiateCall({
        user: {
          id: chat.id,
          name: chat.name,
          avatar: chat.avatar,
        },
        type,
      }),
    );
  };

  // Helper function to check if avatar is valid
  const hasValidAvatar = () => {
    return (
      chat.avatar &&
      typeof chat.avatar === "string" &&
      chat.avatar.trim() !== ""
    );
  };

  return (
    <div className="p-6 flex flex-col items-center text-center border-b border-gray-100 dark:border-gray-800">
      <div className="relative mb-4 w-24 h-24">
        {hasValidAvatar() ? (
          <Image
            src={chat.avatar}
            alt={chat.name}
            fill
            unoptimized
            className="rounded-full object-cover shadow-lg"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 text-xl font-bold">
            {chat.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
        {chat.status === "online" && (
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full z-10" />
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {chat.name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {isGroup
          ? `${chat.members?.length || 0} Members`
          : chat.status === "online"
            ? "Active now"
            : "Last seen recently"}
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleCall("audio")}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            Call
          </span>
        </button>
        <button
          onClick={() => handleCall("video")}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Video className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            Video
          </span>
        </button>
        <button
          onClick={onSearchClick}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center group-hover:bg-gray-600 group-hover:text-white transition-all">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            Search
          </span>
        </button>
      </div>
    </div>
  );
}
