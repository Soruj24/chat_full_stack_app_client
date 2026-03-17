import { motion } from "framer-motion";

export function TypingIndicator({ userName, themeColor }: { userName: string; themeColor?: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
            style={themeColor ? { backgroundColor: themeColor } : {}}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 italic font-medium">
        {userName} is typing...
      </span>
    </div>
  );
}
