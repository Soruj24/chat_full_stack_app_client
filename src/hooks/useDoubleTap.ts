"use client";

import { useRef, useState } from "react";

export function useDoubleTap(onDoubleTap?: () => void) {
  const lastTap = useRef<number>(0);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      onDoubleTap?.();
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 1000);
    }
    lastTap.current = now;
  };

  return {
    handleDoubleTap,
    showAnimation,
  };
}
