export default function Home() {
  return (
    <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md space-y-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Select a chat to start messaging
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Choose from your existing conversations or start a new one with your contacts.
        </p>
      </div>
    </div>
  );
}
