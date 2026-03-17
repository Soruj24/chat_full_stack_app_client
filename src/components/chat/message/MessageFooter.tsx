"use client";

import { Message } from "@/lib/types";
import { MessageInfo } from "./MessageInfo";
import { MessageReactions } from "./MessageReactions";

interface MessageFooterProps {
  message: Message;
  isMe: boolean;
  onReactionClick?: (emoji: string) => void;
}

export function MessageFooter({ message, isMe, onReactionClick }: MessageFooterProps) {
  return (
    <>
      <MessageInfo message={message} isMe={isMe} />
      {message.reactions && message.reactions.length > 0 && (
        <MessageReactions 
          reactions={message.reactions} 
          isMe={isMe} 
          onReactionClick={onReactionClick}
        />
      )}
    </>
  );
}
