"use client";

import { Camera, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import { useState, useRef } from "react";
import { setUser, updateUser } from "@/store/slices/authSlice";
import { toast } from "react-hot-toast";
import { User } from "@/lib/types";

interface ProfileTabProps {
  accentColor?: string;
}

export function ProfileTab({ accentColor = "#3b82f6" }: ProfileTabProps) {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState((user as User)?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [phoneNumber, setPhoneNumber] = useState(
    (user as User)?.phoneNumber || "",
  );
  const [username, setUsername] = useState((user as User)?.username || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      const fileUrl =
        data?.payload?.document?.fileUrl ||
        data?.payload?.fileUrl ||
        data?.fileUrl ||
        data?.url;
      if (!fileUrl) {
        throw new Error("Upload succeeded but no file URL returned");
      }
      setAvatar(fileUrl);
      dispatch(updateUser({ avatar: fileUrl } as Partial<User>));
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      if (!token) {
        throw new Error("Missing user session. Please log in again.");
      }
      const response = await fetch(`/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim(),
          bio: bio.trim(),
          avatar,
          phoneNumber: phoneNumber.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      const newUser = data.payload?.user || data.user || {};
      const normalizedUser = { ...newUser, id: newUser.id || newUser._id };
      dispatch(updateUser(normalizedUser));
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      console.error("Save error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save changes",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Expose save function to parent if needed, but for now we'll add a local save button
  // or handle it via the modal footer (which would require passing the function up).
  // For simplicity and immediate functionality, let's add a local save button for now
  // OR update the component to be used by the modal footer.

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div
            className="w-24 h-24 rounded-full shadow-xl overflow-hidden relative cursor-pointer"
            style={{ boxShadow: `0 0 0 4px ${accentColor}1A` }}
            onClick={handleAvatarClick}
          >
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: accentColor }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 p-2 text-white rounded-full shadow-lg transition-all active:scale-90"
            style={{ backgroundColor: accentColor }}
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          <p className="text-sm text-gray-500">@{username || user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 transition-all"
              style={{ "--tw-ring-color": `${accentColor}33` } as React.CSSProperties}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 pl-8 pr-4 text-sm focus:ring-2 transition-all"
                style={{ "--tw-ring-color": `${accentColor}33` } as React.CSSProperties}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 transition-all resize-none"
            style={{ "--tw-ring-color": `${accentColor}33` } as React.CSSProperties}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 transition-all"
            style={{ "--tw-ring-color": `${accentColor}33` } as React.CSSProperties}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          style={{
            backgroundColor: accentColor,
            boxShadow: `${accentColor}33 0px 8px 24px`,
          }}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile Changes"
          )}
        </button>
      </div>
    </div>
  );
}
