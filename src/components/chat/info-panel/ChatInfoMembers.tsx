"use client";

import Image from "next/image";

interface Member {
  id: string;
  name: string;
  avatar: string;
}

interface ChatInfoMembersProps {
  members: Member[];
}

export function ChatInfoMembers({ members }: ChatInfoMembersProps) {
  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Members</h4>
      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    unoptimized
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 text-xs font-bold">
                    {member.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{member.name}</span>
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-blue-500 cursor-pointer">Admin</span>
          </div>
        ))}
      </div>
    </div>
  );
}
