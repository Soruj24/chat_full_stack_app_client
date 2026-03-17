"use client";

import { motion } from "framer-motion";

interface TextInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function TextInput({
  textareaRef,
  value,
  onChange,
  onKeyDown
}: TextInputProps) {
  return (
    <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Type a message..."
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="w-full bg-gray-100/80 dark:bg-gray-800/80 rounded-xl px-3.5 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500/30 resize-none max-h-32 dark:text-gray-100 border border-transparent focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 custom-scrollbar overflow-y-auto"
      />
    </motion.div>
  );
}
