"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Sun, Bell, Shield, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { ProfileTab } from "../settings/ProfileTab";
import { AppearanceTab } from "../settings/AppearanceTab";
import { NotificationsTab } from "../settings/NotificationsTab";
import { PrivacyTab } from "../settings/PrivacyTab";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { updateUser } from "@/store/slices/authSlice";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { SettingsSidebar } from "../settings/SettingsSidebar";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<
    "profile" | "appearance" | "notifications" | "privacy"
  >("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState({
    showNotifications: true,
    messagePreview: true,
    soundEffects: true,
    notificationSound: "default",
  });

  // Appearance State
  const [appearance, setAppearance] = useState({
    theme: "system" as "light" | "dark" | "system",
    fontSize: "medium" as "small" | "medium" | "large",
    accentColor: "#3b82f6",
    bubbleStyle: "modern" as "modern" | "classic" | "rounded",
  });

  // Privacy State
  const [privacy, setPrivacy] = useState({
    readReceipts: true,
    lastSeenVisibility: "everyone" as "everyone" | "contacts" | "nobody",
    twoFactorAuth: false,
  });

  useEffect(() => {
    if (user?.settings) {
      setNotifications({
        showNotifications: user.settings.showNotifications,
        messagePreview: user.settings.messagePreview,
        soundEffects: user.settings.soundEffects,
        notificationSound: user.settings.notificationSound || "default",
      });
      setAppearance({
        theme: user.settings.theme,
        fontSize: user.settings.fontSize,
        accentColor: user.settings.accentColor || "#3b82f6",
        bubbleStyle: user.settings.bubbleStyle || "modern",
      });
      setPrivacy({
        readReceipts: user.settings.readReceipts ?? true,
        lastSeenVisibility: user.settings.lastSeenVisibility || "everyone",
        twoFactorAuth: user.settings.twoFactorAuth ?? false,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      if (!token) {
        throw new Error("Missing user session. Please log in again.");
      }
      const newPreferences = {
        ...notifications,
        ...appearance,
        ...privacy,
      };
      const outgoingPreferences = {
        ...newPreferences,
        theme:
          (newPreferences as { theme?: string }).theme === "system"
            ? "auto"
            : (newPreferences as { theme?: string }).theme,
      };
      const response = await fetch(`/api/auth/account/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferences: outgoingPreferences }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save settings");
      }

      const data = await response.json();
      const serverPrefs =
        data.payload?.preferences || data.preferences || outgoingPreferences;
      const normalizedPrefs = {
        ...serverPrefs,
        theme:
          (serverPrefs as { theme?: string }).theme === "auto"
            ? "system"
            : (serverPrefs as { theme?: string }).theme,
      };
      dispatch(updateUser({ settings: normalizedPrefs }));
      toast.success("Settings saved successfully");
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] max-h-[90vh]"
          >
            <SettingsSidebar
              activeTab={activeTab}
              onTabChange={(tab) =>
                setActiveTab(
                  tab as "profile" | "appearance" | "notifications" | "privacy",
                )
              }
              onClose={onClose}
              menuItems={menuItems}
            />

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900">
              <div className="hidden md:flex items-center justify-end p-4 border-b border-gray-50 dark:border-gray-800">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {activeTab === "profile" && (
                  <ProfileTab 
                    accentColor={appearance.accentColor} 
                  />
                )}
                {activeTab === "appearance" && (
                  <AppearanceTab
                    settings={appearance}
                    onChange={(newAppearance) =>
                      setAppearance((prev) => ({ ...prev, ...newAppearance }))
                    }
                  />
                )}
                {activeTab === "notifications" && (
                  <NotificationsTab
                    settings={{ ...notifications, accentColor: appearance.accentColor }}
                    onChange={(newNotifications) =>
                      setNotifications((prev) => ({
                        ...prev,
                        ...newNotifications,
                      }))
                    }
                  />
                )}
                {activeTab === "privacy" && (
                  <PrivacyTab
                    settings={privacy}
                    onChange={(newPrivacy) =>
                      setPrivacy((prev) => ({ ...prev, ...newPrivacy }))
                    }
                  />
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 flex justify-end gap-3 mt-auto">
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2",
                    !appearance.accentColor &&
                      "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700",
                  )}
                  style={
                    appearance.accentColor
                      ? {
                          backgroundColor: appearance.accentColor,
                          boxShadow: `${appearance.accentColor}33 0px 8px 24px`,
                        }
                      : {}
                  }
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
