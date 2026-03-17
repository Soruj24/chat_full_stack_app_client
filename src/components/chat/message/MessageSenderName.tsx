"use client";

import { cn } from "@/lib/utils";

interface MessageSenderNameProps {
  name: string;
}

export function MessageSenderName({ name }: MessageSenderNameProps) {
  return (
    <p className="px-3 pt-2 text-xs font-bold text-blue-500 dark:text-blue-400">
      {name}
    </p>
  );
}
