"use client";

import { ChevronLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProfileHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="font-semibold dark:text-gray-100">User Info</h2>
      </div>
      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
        <MoreVertical className="w-6 h-6 text-gray-500" />
      </button>
    </header>
  );
}
