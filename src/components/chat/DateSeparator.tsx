export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex justify-center my-6">
      <span className="px-3 py-1 bg-gray-200/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-[11px] font-medium rounded-full backdrop-blur-sm">
        {date}
      </span>
    </div>
  );
}
