"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarSearch } from "./sidebar/SidebarSearch";
import { SidebarFilters } from "./sidebar/SidebarFilters";
import { SettingsModal } from "./chat/SettingsModal";
import { NewGroupModal } from "./chat/NewGroupModal";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { SidebarSearchResults } from "./sidebar/SidebarSearchResults";
import { SidebarChatList } from "./sidebar/SidebarChatList";
import { useSidebar } from "@/hooks/useSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const { activeChatId } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const activeId = pathname?.startsWith('/chat/') ? pathname.split('/')[2] : undefined;
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "groups" | "archived">("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  
  const {
    searchResults,
    allUsers,
    pinnedChats,
    otherChats,
    loadingChats,
    handleTogglePin,
    handleToggleArchive,
    handleToggleMute,
    handleDeleteChat,
  } = useSidebar(searchQuery, filter);

  if (pathname === '/auth') return null;

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  return (
    <aside className={cn(
      "w-full md:w-80 h-screen flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all overflow-hidden",
      activeId ? "hidden md:flex" : "flex"
    )}>
      {/* Sidebar Header Section */}
      <div className="p-4 flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <SidebarHeader 
          mounted={mounted}
          theme={theme}
          setTheme={setTheme}
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onNewGroupOpen={() => setIsNewGroupOpen(true)}
        />

        <SidebarSearch 
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setIsSearching(val.length > 0);
          }}
          onClear={clearSearch}
        />

        {!isSearching && (
          <SidebarFilters 
            activeFilter={filter}
            onFilterChange={setFilter}
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
        {isSearching ? (
          <SidebarSearchResults results={searchResults} activeId={activeId} />
        ) : (
          <SidebarChatList 
            pinnedChats={pinnedChats}
            otherChats={otherChats}
            allUsers={allUsers}
            activeId={activeId}
            loading={loadingChats}
            onPin={handleTogglePin}
            onMute={handleToggleMute}
            onArchive={handleToggleArchive}
            onDelete={handleDeleteChat}
          />
        )}
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <NewGroupModal isOpen={isNewGroupOpen} onClose={() => setIsNewGroupOpen(false)} />
    </aside>
  );
}
