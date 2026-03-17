"use client";

import { ChevronRight, Shield, Eye, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivacyTabProps {
  settings: {
    readReceipts: boolean;
    lastSeenVisibility: 'everyone' | 'contacts' | 'nobody';
    twoFactorAuth: boolean;
  };
  onChange: (settings: Partial<PrivacyTabProps["settings"]>) => void;
}

export function PrivacyTab({ settings, onChange }: PrivacyTabProps) {
  const items = [
    { 
      id: "lastSeenVisibility",
      label: "Last Seen & Online", 
      value: settings.lastSeenVisibility.charAt(0).toUpperCase() + settings.lastSeenVisibility.slice(1),
      icon: Eye,
      options: ['everyone', 'contacts', 'nobody']
    },
    { 
      id: "readReceipts",
      label: "Read Receipts", 
      value: settings.readReceipts ? "Enabled" : "Disabled",
      icon: CheckCircle2,
      type: "toggle"
    },
    { 
      id: "twoFactorAuth",
      label: "Two-Factor Authentication", 
      value: settings.twoFactorAuth ? "Enabled" : "Disabled",
      icon: Lock,
      type: "toggle"
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {items.map((item, i) => (
        <div key={item.id} className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
          {item.type === "toggle" ? (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                  <item.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.label}</h4>
                  <p className="text-[10px] text-gray-500">Currently {item.value}</p>
                </div>
              </div>
              <div 
                onClick={() => onChange({ [item.id]: !settings[item.id as keyof typeof settings] })}
                className={cn(
                  "w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200",
                  settings[item.id as keyof typeof settings] ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full transition-transform duration-200",
                  settings[item.id as keyof typeof settings] ? "translate-x-5" : "translate-x-0"
                )} />
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                  <item.icon className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.label}</h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {item.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onChange({ [item.id]: opt })}
                    className={cn(
                      "py-2 px-3 rounded-xl text-[10px] font-bold transition-all",
                      settings.lastSeenVisibility === opt 
                        ? "bg-blue-600 text-white" 
                        : "bg-white dark:bg-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                    )}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
