import { cn } from "@/lib/utils";
import { Clock, AlertCircle } from "lucide-react";

interface MessageStatusProps {
  status: "sent" | "delivered" | "read" | "sending" | "error";
  className?: string;
}

export function MessageStatus({ status, className }: MessageStatusProps) {
  if (status === "sending") {
    return <Clock className={cn("w-3 h-3 text-white/50 animate-pulse", className)} />;
  }

  if (status === "error") {
    return <AlertCircle className={cn("w-3.5 h-3.5 text-red-400", className)} />;
  }

  if (status === "sent") {
    return (
      <svg
        className={cn("w-3.5 h-3.5 text-white/50", className)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }

  return (
    <div className={cn("flex -space-x-2", className)}>
      <svg
        className={cn(
          "w-3.5 h-3.5",
          status === "read" ? "text-blue-300" : "text-white/50"
        )}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <svg
        className={cn(
          "w-3.5 h-3.5",
          status === "read" ? "text-blue-300" : "text-white/50"
        )}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}
