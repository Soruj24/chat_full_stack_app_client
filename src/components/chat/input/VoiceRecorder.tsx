"use client";

import { motion } from "framer-motion";

interface VoiceRecorderProps {
  recordingTime: number;
  waveform: number[];
  onCancel: () => void;
  formatTime: (seconds: number) => string;
  themeColor?: string;
}

export function VoiceRecorder({
  recordingTime,
  waveform,
  onCancel,
  formatTime,
  themeColor
}: VoiceRecorderProps) {
  return (
    <motion.div
      key="recording"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-2"
      style={themeColor ? { backgroundColor: `${themeColor}10` } : {}}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span 
          className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400"
          style={themeColor ? { color: themeColor } : {}}
        >
          {formatTime(recordingTime)}
        </span>
      </div>

      <div className="flex-1 flex items-center gap-0.5 h-6">
        {waveform.map((height, i) => (
          <motion.div
            key={i}
            initial={{ height: 2 }}
            animate={{ height }}
            className="w-1 bg-blue-400 dark:bg-blue-600 rounded-full"
            style={themeColor ? { backgroundColor: themeColor } : {}}
          />
        ))}
      </div>

      <button
        onClick={onCancel}
        className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
      >
        Cancel
      </button>
    </motion.div>
  );
}
