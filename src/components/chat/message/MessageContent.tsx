"use client";

import { Message } from "@/lib/types";
import { ImageMessage } from "./ImageMessage";
import { VideoMessage } from "./VideoMessage";
import { VoiceMessage } from "./VoiceMessage";
import { FileIcon, MapPin, User } from "lucide-react";
import React from "react";
import { FormattedText } from "./FormattedText";
import { cn } from "@/lib/utils";

interface MessageContentProps {
  message: Message;
  isMe: boolean;
  highlight?: string;
  onImageClick?: (url: string) => void;
  themeColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
  bubbleStyle?: 'modern' | 'classic' | 'rounded';
}

export function MessageContent({
  message,
  isMe,
  highlight,
  onImageClick,
  themeColor,
  fontSize = 'medium',
  bubbleStyle,
}: MessageContentProps) {
  const fontSizeClass = {
    small: "text-[12px]",
    medium: "text-[14px]",
    large: "text-[16px]",
  }[fontSize];

  return (
    <>
      {/* Media Content */}
      {message.type === "image" && message.mediaUrl && (
        <ImageMessage 
          message={message}
          isMe={isMe}
          onImageClick={onImageClick} 
          bubbleStyle={bubbleStyle}
        />
      )}

      {message.type === "video" && message.mediaUrl && (
        <VideoMessage url={message.mediaUrl} />
      )}

      {message.type === "file" && (
        <a 
          href={message.mediaUrl} 
          download={message.fileName || "file"}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group max-w-[300px]"
        >
          <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <FileIcon className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn("font-semibold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors", fontSizeClass)}>
              {message.fileName || "File"}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {message.fileSize && message.fileSize !== "Size Unknown" && (
                <>
                  <span className="text-[10px] font-medium opacity-60 uppercase tracking-wider">
                    {message.fileSize}
                  </span>
                  <span className="text-[10px] opacity-40">•</span>
                </>
              )}
              <span className="text-[10px] font-medium text-blue-500 dark:text-blue-400 opacity-80 group-hover:opacity-100">
                Download
              </span>
            </div>
          </div>
        </a>
      )}

      {message.type === "voice" && (
        <VoiceMessage 
          url={message.mediaUrl}
          duration={message.duration || "0:00"} 
          messageId={message.id} 
          isMe={isMe} 
          themeColor={themeColor}
        />
      )}

      {message.type === "location" && message.location && (
        <div className="p-3">
          <a 
            href={`https://www.google.com/maps?q=${message.location.latitude},${message.location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 group"
          >
            <div className="relative h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
              <MapPin className="w-8 h-8 text-green-500 animate-bounce" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="p-1.5 bg-green-500/10 rounded-lg shrink-0"
                style={!isMe && themeColor ? { backgroundColor: `${themeColor}20` } : {}}
              >
                <MapPin 
                  className="w-4 h-4 text-green-500" 
                  style={!isMe && themeColor ? { color: themeColor } : {}}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span 
                  className={cn("font-medium text-blue-500 hover:underline block truncate", fontSizeClass)}
                  style={!isMe && themeColor ? { color: themeColor } : {}}
                >
                  {message.location.address || "View Location"}
                </span>
                {message.location.address && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 block truncate">
                    {message.location.latitude.toFixed(4)}, {message.location.longitude.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
          </a>
        </div>
      )}

      {message.type === "contact" && message.contact && (
        <div className="p-3 min-w-[200px]">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <User className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("font-bold truncate", fontSizeClass)}>{message.contact.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{message.contact.phoneNumber}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${message.contact?.name}\nTEL:${message.contact?.phoneNumber}\nEND:VCARD`;
              const blob = new Blob([vcard], { type: 'text/vcard' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `${message.contact?.name}.vcf`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="w-full mt-2 py-2 text-xs font-semibold text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors border border-orange-100 dark:border-orange-900/30"
          >
            Save Contact
          </button>
        </div>
      )}

      {/* Text Content */}
      {message.text && (
        <div className={cn("px-4 py-2.5 break-words leading-relaxed", fontSizeClass)}>
          <FormattedText text={message.text} query={highlight} />
        </div>
      )}
    </>
  );
}
