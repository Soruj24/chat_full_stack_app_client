"use client";

import Image from "next/image";

interface ChatInfoMediaPreviewProps {
  allMedia: { id: number; url: string }[];
  onViewAll: () => void;
}

export function ChatInfoMediaPreview({ allMedia, onViewAll }: ChatInfoMediaPreviewProps) {
  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Shared Media</h4>
        <button 
          onClick={onViewAll}
          className="text-[11px] font-bold text-blue-600 hover:underline"
        >
          View All
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {allMedia.slice(0, 6).map((item) => (
          <div key={item.id} className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-100 dark:border-gray-800">
            {item.url ? (
              <Image
                src={item.url}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-400">
                <span className="text-[10px]">No image</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
