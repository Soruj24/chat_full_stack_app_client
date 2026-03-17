"use client";

import Image from "next/image";
import { UserStatus } from "@/lib/types";

interface ChatAvatarProps {
  avatar?: string | null;
  name: string;
  status?: UserStatus;
}

export function ChatAvatar({ avatar, name, status }: ChatAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hasAvatar =
    typeof avatar === "string" && avatar.trim().length > 0;

  return (
    <div className="relative flex-shrink-0 w-12 h-12">
      {hasAvatar ? (
        <Image
          src={avatar}
          alt={name || "Chat avatar"}
          fill
          unoptimized
          className="rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-800"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-inner ring-1 ring-blue-400/30">
          {initials}
        </div>
      )}

      {status === "online" && (
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full z-10 shadow-sm" />
      )}

      {status === "typing" && (
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-blue-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse z-10 shadow-sm" />
      )}
    </div>
  );
}