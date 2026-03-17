"use client";

import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addChat, setActiveChat } from "@/store/slices/chatSlice";
import { useRouter } from "next/navigation";
import { socketService } from "@/lib/socket/socket-client";
import { User, UserStatus } from "@/lib/types";

export function useNewGroup(onClose: () => void) {
  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const response = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const resData = await response.json();
          const data = resData.payload?.users || resData.payload || resData;
          const usersArr = Array.isArray(data) ? data : (data?.users || []);
          const mappedUsers: User[] = usersArr.map(
            (u: {
              _id?: string;
              id?: string;
              name?: string;
              avatar?: string;
              username?: string;
              status?: string;
            }) => ({
              id: (u._id || u.id || "").toString(),
              name: u.username || u.name || "",
              avatar: u.avatar || "",
              username: u.username || "",
              status: (u.status as UserStatus) || "offline",
            }),
          );
          setAllUsers(mappedUsers);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [token]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allUsers.filter((u) => {
      const n = (u.name || "").toLowerCase();
      const un = (u.username || "").toLowerCase();
      return n.includes(q) || un.includes(q);
    });
  }, [searchQuery, allUsers]);

  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleNext = () => {
    if (selectedUsers.size > 0) setStep(2);
  };

  const handleCreate = async () => {
    if (!token || !groupName || selectedUsers.size === 0) return;

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "group",
          name: groupName,
          description: description,
          participantIds: Array.from(selectedUsers),
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        const chatData = resData.payload || resData;
        const mappedChat = {
          id: chatData._id,
          name: chatData.name,
          avatar: chatData.avatar,
          type: chatData.type,
          unreadCount: 0,
          description: chatData.description,
          members: chatData.participants.map(
            (p: {
              _id?: string;
              id?: string;
              name: string;
              avatar: string;
              username?: string;
              status?: string;
            }) => ({
              id: (p._id || p.id || "").toString(),
              name: p.name,
              avatar: p.avatar,
              username: p.username || "",
              status: (p.status as UserStatus) || "offline",
            }),
          ),
        };

        dispatch(addChat(mappedChat));
        dispatch(setActiveChat(mappedChat.id));

        // Emit socket event for all participants
        socketService.emit("new_chat", {
          chat: mappedChat,
          participants: chatData.participants.map(
            (p: { _id?: string; id?: string }) => p._id || p.id,
          ),
        });

        onClose();
        setStep(1);
        setSelectedUsers(new Set());
        setGroupName("");
        setDescription("");
        if (mappedChat.id) {
          router.push(`/chat/${mappedChat.id}`);
        } else {
          console.warn("New group created with no id", mappedChat);
        }
      } else {
        const error = await response.json();
        console.error("Failed to create group:", error.message);
      }
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  return {
    step,
    setStep,
    searchQuery,
    setSearchQuery,
    selectedUsers,
    setSelectedUsers,
    groupName,
    setGroupName,
    description,
    setDescription,
    filteredUsers,
    allUsers,
    toggleUser,
    handleNext,
    handleCreate,
  };
}
