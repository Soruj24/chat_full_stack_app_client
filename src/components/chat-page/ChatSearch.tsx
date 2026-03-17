"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, X } from "lucide-react";

interface ChatSearchProps {
  isOpen: boolean;
  query: string;
  setQuery: (query: string) => void;
  filteredCount: number;
  currentIndex: number;
  onNavigate: (direction: "up" | "down") => void;
  onClose: () => void;
}

export function ChatSearch({
  isOpen,
  query,
  setQuery,
  filteredCount,
  currentIndex,
  onNavigate,
  onClose
}: ChatSearchProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="p-2 md:p-3 max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in conversation..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {query && (
                  <>
                    <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg px-2 py-0.5 mr-2">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                        {filteredCount > 0 ? currentIndex + 1 : 0}/{filteredCount}
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigate("up")}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 rotate-90" />
                    </button>
                    <button
                      onClick={() => onNavigate("down")}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 -rotate-90" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {query && (
              <p className="text-[11px] text-gray-400 mt-2 font-medium px-1">
                Found {filteredCount} results
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
