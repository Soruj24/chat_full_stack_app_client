"use client";

import { Download, Play } from "lucide-react";

interface VideoMessageProps {
  url: string;
}

export function VideoMessage({ url }: VideoMessageProps) {
  return (
    <div className="p-1 relative group/video">
      <video
        src={url}
        className="rounded-xl w-full max-h-80 object-cover"
        controls
      />
      <a 
        href={url} 
        download 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover/video:opacity-100 transition-opacity hover:bg-black/70"
        onClick={(e) => e.stopPropagation()}
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}
