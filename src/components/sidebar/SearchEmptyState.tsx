"use client";

interface SearchEmptyStateProps {
  onClear?: () => void;
}

export function SearchEmptyState({ onClear }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <SearchIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
      </div>
      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">No results found</p>
      <p className="text-xs text-gray-500 mt-1">Try searching for something else</p>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
