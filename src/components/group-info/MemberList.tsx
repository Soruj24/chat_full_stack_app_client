"use client";

import { motion } from "framer-motion";
import { Users, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { User } from "@/lib/types";

interface MemberListProps {
  members: User[];
}

export function MemberList({ members }: MemberListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          Members
        </h3>
        <button className="text-sm text-blue-500 font-medium flex items-center gap-1 hover:underline">
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {members?.map((member) => (
          <Link
            key={member.id}
            href={`/profile/${member.id === "me" ? "" : member.id}`}
            className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src={
                  (member.avatar && member.avatar.trim() !== "")
                    ? member.avatar
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || "User")}`
                }
                alt={member.name || "Member avatar"}
                fill
                unoptimized
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {member.name}
                  {member.id === "me" && " (You)"}
                </span>
                {member.id === "1" && (
                  <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-[10px] text-blue-500 rounded border border-blue-100 dark:border-blue-800">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-green-500">{member.status}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
