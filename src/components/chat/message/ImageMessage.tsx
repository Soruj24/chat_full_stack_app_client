"use client";

import { Download, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Message } from "@/lib/types";
import { MessageStatus } from "./MessageStatus";
import { Star, Pin, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageMessageProps {
  message: Message;
  isMe: boolean;
  onImageClick?: (url: string) => void;
  bubbleStyle?: 'modern' | 'classic' | 'rounded';
}

export function ImageMessage({
  message,
  isMe,
  onImageClick,
  bubbleStyle = 'modern',
}: ImageMessageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const url = message.mediaUrl;

  if (!url || url.trim() === "") {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center gap-2 text-gray-500">
        <ImageIcon className="w-5 h-5" />
        <span className="text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative group/image overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md",
      bubbleStyle === 'modern' && (isMe ? "rounded-2xl rounded-tr-none" : "rounded-2xl rounded-tl-none"),
      bubbleStyle === 'classic' && "rounded-lg",
      bubbleStyle === 'rounded' && "rounded-3xl",
      !bubbleStyle && "rounded-2xl",
      "bg-gray-100 dark:bg-gray-800"
    )}>
      {/* Loading Shimmer */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}

      <div
        className={cn(
          "relative w-full min-w-[240px] max-w-[400px] overflow-hidden transition-all duration-500",
          isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100",
        )}
      >
        <Image
          src={url}
          alt="Message content"
          width={400}
          height={300}
          unoptimized
          className="w-full h-auto max-h-[500px] object-cover cursor-pointer transition-transform duration-500 group-hover/image:scale-105"
          onClick={() => onImageClick?.(url)}
          onLoadingComplete={() => setIsLoading(false)}
        />

        {/* Bottom Gradient Overlay for Info Visibility */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Message Info Overlay */}
        <div className="absolute bottom-2 right-3 flex items-center gap-1.5 select-none pointer-events-none">
          <div className="flex items-center gap-1">
            {message.isStarred && (
              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            )}
            {message.isPinned && (
              <Pin className="w-2.5 h-2.5 rotate-45 text-white/90" />
            )}
          </div>
          <span className="text-[10px] font-semibold text-white/95 tracking-tight">
            {message.timestamp}
          </span>
          {isMe && (
            <div className="flex items-center ml-0.5 filter drop-shadow-sm">
              <MessageStatus status={message.status || "sent"} />
            </div>
          )}
        </div>
      </div>

      {/* Download Button */}
      <a
        href={url}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 p-2.5 bg-black/40 backdrop-blur-md text-white rounded-full opacity-0 group-hover/image:opacity-100 transition-all duration-300 hover:bg-black/60 translate-y-2 group-hover/image:translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}
