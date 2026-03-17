"use client";

import { X, Download, Share2 } from "lucide-react";

interface LightboxControlsProps {
  url: string;
  onClose: () => void;
}

export function LightboxControls({ url, onClose }: LightboxControlsProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = `image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shared Image',
          url: url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="absolute top-6 right-6 flex gap-3 z-50">
      <button 
        onClick={handleDownload}
        className="p-3 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        title="Download"
      >
        <Download className="w-5 h-5" />
      </button>
      <button 
        onClick={handleShare}
        className="p-3 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        title="Share"
      >
        <Share2 className="w-5 h-5" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="p-3 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        title="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
