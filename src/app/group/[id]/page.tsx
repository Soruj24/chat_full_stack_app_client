"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMemo } from "react";
import { GroupHeader } from "@/components/group-info/GroupHeader";
import { GroupCard } from "@/components/group-info/GroupCard";
import { MemberList } from "@/components/group-info/MemberList";
import { GroupSettings } from "@/components/group-info/GroupSettings";

export default function GroupInfoPage() {
  const { id } = useParams();
  const { chats } = useSelector((state: RootState) => state.chat);
  const chat = useMemo(() => chats.find((c) => c.id === id && c.type === "group"), [chats, id]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Group not found
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
      <GroupHeader />

      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <GroupCard chat={chat} />
        <MemberList members={chat.members || []} />
        <GroupSettings />
      </div>
    </div>
  );
}
