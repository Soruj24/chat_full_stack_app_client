"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { User } from "@/lib/types";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id || !token) return;
      try {
        const response = await fetch(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch user:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  if (isLoading) return <div className="flex-1 flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        User not found
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
      <ProfileHeader />

      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <ProfileCard user={user} />
        <ProfileInfo user={user} />
        <ProfileSettings />
      </div>
    </div>
  );
}
