"use client";

import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppearanceTabProps {
  settings: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    accentColor: string;
    bubbleStyle: 'modern' | 'classic' | 'rounded';
  };
  onChange: (settings: Partial<AppearanceTabProps["settings"]>) => void;
}

const ACCENT_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Orange", value: "#f97316" },
  { name: "Green", value: "#22c55e" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Emerald", value: "#10b981" },
];

const BUBBLE_STYLES = [
  { id: "modern", label: "Modern", preview: "rounded-2xl rounded-tr-sm" },
  { id: "classic", label: "Classic", preview: "rounded-lg" },
  { id: "rounded", label: "Rounded", preview: "rounded-3xl" },
];

export function AppearanceTab({ settings, onChange }: AppearanceTabProps) {
  const accentColor = settings.accentColor || "#3b82f6";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 pb-4">
      <div>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "light", icon: Sun, label: "Light" },
            { id: "dark", icon: Moon, label: "Dark" },
            { id: "system", icon: Monitor, label: "System" },
          ].map((theme) => {
            const Icon = theme.icon;
            const isActive = settings.theme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onChange({ theme: theme.id as 'light' | 'dark' | 'system' })}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-900/20" 
                    : "border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
                style={isActive ? { borderColor: accentColor, backgroundColor: `${accentColor}15` } : {}}
              >
                <Icon className={cn("w-6 h-6", isActive ? "" : "text-gray-600 dark:text-gray-300")} style={isActive ? { color: accentColor } : {}} />
                <span className={cn("text-xs font-bold", isActive ? "" : "text-gray-900 dark:text-gray-100")} style={isActive ? { color: accentColor } : {}}>
                  {theme.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Accent Color</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {ACCENT_COLORS.map((color) => {
            const isActive = settings.accentColor === color.value;
            return (
              <button
                key={color.value}
                onClick={() => onChange({ accentColor: color.value })}
                className={cn(
                  "w-full aspect-square rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95",
                  isActive ? "ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600" : ""
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {isActive && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Message Bubbles</h3>
        <div className="grid grid-cols-3 gap-3">
          {BUBBLE_STYLES.map((style) => {
            const isActive = settings.bubbleStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onChange({ bubbleStyle: style.id as 'modern' | 'classic' | 'rounded' })}
                className={cn(
                  "flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all",
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-900/20" 
                    : "border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
                style={isActive ? { borderColor: accentColor, backgroundColor: `${accentColor}15` } : {}}
              >
                <div className="flex flex-col gap-1.5 w-full">
                  <div className={cn("w-full h-8", style.preview)} style={{ backgroundColor: `${accentColor}40` }} />
                  <div className={cn("w-2/3 h-8 bg-gray-200 dark:bg-gray-700", style.preview)} />
                </div>
                <span className={cn("text-xs font-bold text-center", isActive ? "" : "text-gray-900 dark:text-gray-100")} style={isActive ? { color: accentColor } : {}}>
                  {style.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Chat Font Size</h3>
        <div className="px-2">
          <input 
            type="range" 
            min="0"
            max="2"
            step="1"
            value={settings.fontSize === 'small' ? 0 : settings.fontSize === 'medium' ? 1 : 2}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              const size = val === 0 ? 'small' : val === 1 ? 'medium' : 'large';
              onChange({ fontSize: size });
            }}
            className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: accentColor }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter px-1">
          <span style={settings.fontSize === 'small' ? { color: accentColor } : {}}>Small</span>
          <span style={settings.fontSize === 'medium' ? { color: accentColor } : {}}>Medium</span>
          <span style={settings.fontSize === 'large' ? { color: accentColor } : {}}>Large</span>
        </div>
      </div>
    </div>
  );
}
