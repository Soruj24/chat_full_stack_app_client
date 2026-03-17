"use client";

import React from "react";
import { Skeleton } from "../ui/Skeleton";

export function MessageListSkeleton({ count = 8, groupAvatar = false }: { count?: number; groupAvatar?: boolean; }) {
  const items = Array.from({ length: count });
  return (
    <div className="flex flex-col space-y-4 py-4">
      {items.map((_, idx) => (
        <div key={idx} className="flex items-start gap-2">
          {groupAvatar && <Skeleton className="w-8 h-8 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
