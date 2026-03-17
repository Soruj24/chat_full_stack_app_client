"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LightboxControls } from "./LightboxControls";

interface LightboxProps {
  url: string | null;
  onClose: () => void;
}

export function Lightbox({ url, onClose }: LightboxProps) {
  if (!url) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <LightboxControls url={url} onClose={onClose} />
        
        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          src={url}
          alt="Preview"
          className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}
