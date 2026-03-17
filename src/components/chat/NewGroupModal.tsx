"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UserSelectionStep } from "../new-group/UserSelectionStep";
import { GroupDetailsStep } from "../new-group/GroupDetailsStep";
import { NewGroupHeader } from "../new-group/NewGroupHeader";
import { NewGroupFooter } from "../new-group/NewGroupFooter";
import { useNewGroup } from "@/hooks/useNewGroup";

interface NewGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewGroupModal({ isOpen, onClose }: NewGroupModalProps) {
  const {
    step,
    setStep,
    searchQuery,
    setSearchQuery,
    selectedUsers,
    groupName,
    setGroupName,
    description,
    setDescription,
    filteredUsers,
    allUsers,
    toggleUser,
    handleNext,
    handleCreate,
  } = useNewGroup(onClose);

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
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]"
          >
            <NewGroupHeader 
              step={step} 
              selectedCount={selectedUsers.size} 
              onClose={onClose} 
            />

            <div className="flex-1 overflow-y-auto p-4">
              {step === 1 ? (
                <UserSelectionStep 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedUsers={selectedUsers}
                  onToggleUser={toggleUser}
                  filteredUsers={filteredUsers}
                  allUsers={allUsers}
                />
              ) : (
                <GroupDetailsStep 
                  groupName={groupName}
                  onGroupNameChange={setGroupName}
                  description={description}
                  onDescriptionChange={setDescription}
                />
              )}
            </div>

            <NewGroupFooter 
              step={step}
              onBack={() => setStep(1)}
              onCancel={onClose}
              onNext={handleNext}
              onCreate={handleCreate}
              canNext={selectedUsers.size > 0}
              canCreate={groupName.trim().length > 0}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
