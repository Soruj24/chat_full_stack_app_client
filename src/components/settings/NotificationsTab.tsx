"use client";

import { Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationsTabProps {
  settings: {
    showNotifications: boolean;
    messagePreview: boolean;
    soundEffects: boolean;
    notificationSound: string;
    accentColor?: string;
  };
  onChange: (settings: Partial<NotificationsTabProps["settings"]>) => void;
}

export function NotificationsTab({ settings, onChange }: NotificationsTabProps) {
  const accentColor = settings.accentColor || "#3b82f6";
  const items = [
    { id: "showNotifications", label: "Show Notifications", description: "Get real-time updates when you receive a message" },
    { id: "messagePreview", label: "Message Preview", description: "Show message content in notifications" },
    { id: "soundEffects", label: "Sound Effects", description: "Play sounds for incoming messages" },
  ] as const;

  const SOUNDS = [
    { name: "Default", value: "default" },
    { name: "Chime", value: "chime" },
    { name: "Bubble", value: "bubble" },
    { name: "Ding", value: "ding" },
    { name: "Modern", value: "modern" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <div className="flex-1 pr-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.label}</h4>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings[item.id as keyof typeof settings] as boolean} 
              onChange={(e) => onChange({ [item.id]: e.target.checked })}
            />
            <div 
              className={cn(
                "w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all",
                !settings[item.id as keyof typeof settings] && "bg-gray-200 dark:bg-gray-700"
              )}
              style={settings[item.id as keyof typeof settings] ? { backgroundColor: accentColor } : {}}
            ></div>
          </label>
        </div>
      ))}

      {settings.soundEffects && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" style={{ color: accentColor }} />
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Notification Sound</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SOUNDS.map((sound) => {
              const isActive = settings.notificationSound === sound.value;
              return (
                <button
                  key={sound.value}
                  onClick={() => onChange({ notificationSound: sound.value })}
                  className={cn(
                    "py-2 px-3 rounded-xl text-xs font-bold transition-all border",
                    isActive
                      ? "text-white"
                      : "bg-white dark:bg-gray-700 text-gray-500 border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  )}
                  style={isActive ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                >
                  {sound.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
