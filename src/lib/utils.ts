import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes?: number | string) {
  if (!bytes) return "";
  const numBytes = typeof bytes === 'string' ? parseInt(bytes) : bytes;
  if (isNaN(numBytes) || numBytes === 0) return typeof bytes === 'string' ? bytes : "";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileNameFromUrl(url?: string) {
  if (!url) return "File";
  try {
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    // Remove the timestamp prefix if it exists (e.g., 123456789-filename.pdf)
    const fileName = lastPart.includes("-") ? lastPart.split("-").slice(1).join("-") : lastPart;
    return decodeURIComponent(fileName) || "File";
  } catch (e) {
    return "File";
  }
}

export function getUserColor(name?: string) {
  if (!name) return "from-blue-500 to-blue-600";
  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
    "from-teal-500 to-teal-600",
    "from-orange-500 to-orange-600",
    "from-emerald-500 to-emerald-600",
  ];
  const index = name.length % colors.length;
  return colors[index];
}