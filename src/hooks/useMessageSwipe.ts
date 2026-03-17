"use client";

import { useMotionValue, useTransform, MotionValue } from "framer-motion";

export function useMessageSwipe(isMe: boolean, onReply?: () => void) {
  const x = useMotionValue(0);
  const replyOpacity = useTransform(x, [0, 100], [0, 1]);
  const replyScale = useTransform(x, [0, 100], [0.5, 1]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    if (info.offset.x > 50 && !isMe) {
      onReply?.();
    } else if (info.offset.x < -50 && isMe) {
      onReply?.();
    }
  };

  return {
    x,
    replyOpacity,
    replyScale,
    handleDragEnd,
  };
}
