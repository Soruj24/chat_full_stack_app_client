"use client";

import { Send, Mic } from "lucide-react";

interface SendButtonProps {
  isRecording: boolean;
  hasValue: boolean;
  onSend: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  themeColor?: string;
}

export function SendButton({
  isRecording,
  hasValue,
  onSend,
  onStartRecording,
  onStopRecording,
  themeColor
}: SendButtonProps) {
  if (hasValue || isRecording) {
    return (
      <button 
        onClick={isRecording ? onStopRecording : onSend}
        className="p-2.5 bg-blue-600 text-white rounded-full hover:opacity-90 transition-all duration-200 active:scale-90 shadow-lg shadow-blue-500/20"
        style={themeColor ? { backgroundColor: themeColor } : {}}
      >
        <Send className="w-4.5 h-4.5" />
      </button>
    );
  }

  return (
    <button 
      onClick={onStartRecording}
      className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-full transition-all duration-200 active:scale-90"
    >
      <Mic className="w-4.5 h-4.5" />
    </button>
  );
}
