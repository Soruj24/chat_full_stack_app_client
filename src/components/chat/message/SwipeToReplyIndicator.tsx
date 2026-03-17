"use client";

import { motion, MotionValue } from "framer-motion";
import { CornerUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeToReplyIndicatorProps {
  x: MotionValue<number>;
  replyOpacity: MotionValue<number>;
  replyScale: MotionValue<number>;
  isMe: boolean;
}

export function SwipeToReplyIndicator({ x, replyOpacity, replyScale, isMe }: SwipeToReplyIndicatorProps) {
  return (
    <motion.div 
      style={{ opacity: replyOpacity, scale: replyScale }}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-500/10 text-blue-500",
        isMe ? "right-full mr-4" : "left-full ml-4"
      )}
    >
      <CornerUpRight className="w-5 h-5" />
    </motion.div>
  );
}
