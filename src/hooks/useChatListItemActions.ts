"use client";

import { useState, useRef, useEffect } from "react";
import { PanInfo } from "framer-motion";

export function useChatListItemActions(
  chatId: string,
  onPin?: (id: string) => void,
  onArchive?: (id: string) => void
) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };
    if (showContextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showContextMenu]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x > 100) {
      onPin?.(chatId);
    } else if (info.offset.x < -100) {
      onArchive?.(chatId);
    }
  };

  return {
    showContextMenu,
    setShowContextMenu,
    menuPosition,
    menuRef,
    handleContextMenu,
    handleDragEnd,
  };
}
