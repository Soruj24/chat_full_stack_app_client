"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface ChatMediaViewProps {
  allMedia: { id: number; url: string }[];
  onBack: () => void;
}

export function ChatMediaView({ allMedia, onBack }: ChatMediaViewProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Media View Header */}
      <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">Media</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase">{allMedia.length} Files</p>
        </div>
      </div>

      {/* Media Grid */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="grid grid-cols-3 gap-2">
          {allMedia.map((item) => (
            <div 
              key={item.id} 
              className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-all border border-gray-100 dark:border-gray-800 hover:scale-[1.02]"
            >
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
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
