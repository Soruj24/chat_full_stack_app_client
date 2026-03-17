"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="p-8">
          <h1 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-2">
            404 - Page Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8 font-medium">
            The page you are looking for does not exist.
          </p>
          <Link href="/" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70">
            Go back to the homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
