"use client";

import { Message } from "@/lib/types";
import { MessageSenderName } from "./MessageSenderName";
import { MessageReplyPreview } from "./MessageReplyPreview";
import { MessageForwardedLabel } from "./MessageForwardedLabel";

interface MessageHeaderProps {
  message: Message;
  isMe: boolean;
  showSenderName?: boolean;
  themeColor?: string;
}

export function MessageHeader({ message, isMe, showSenderName, themeColor }: MessageHeaderProps) {
  const hasHeader = (showSenderName && message.senderName && !isMe) || message.replyTo || message.isForwarded;
  
  if (!hasHeader) return null;

  return (
    <>
      {showSenderName && message.senderName && !isMe && (
        <MessageSenderName name={message.senderName} />
      )}
      {message.replyTo && (
        <MessageReplyPreview replyTo={message.replyTo} isMe={isMe} themeColor={themeColor} />
      )}
      {message.isForwarded && (
        <MessageForwardedLabel isMe={isMe} />
      )}
    </>
  );
}
