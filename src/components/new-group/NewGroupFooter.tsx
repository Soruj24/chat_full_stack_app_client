"use client";

import { ChevronRight } from "lucide-react";

interface NewGroupFooterProps {
  step: 1 | 2;
  onBack: () => void;
  onCancel: () => void;
  onNext: () => void;
  onCreate: () => void;
  canNext: boolean;
  canCreate: boolean;
}

export function NewGroupFooter({ 
  step, 
  onBack, 
  onCancel, 
  onNext, 
  onCreate, 
  canNext, 
  canCreate 
}: NewGroupFooterProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 flex justify-between gap-3 mt-auto">
      {step === 2 && (
        <button 
          onClick={onBack}
          className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          Back
        </button>
      )}
      <div className="flex gap-3 ml-auto">
        <button 
          onClick={onCancel}
          className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          Cancel
        </button>
        {step === 1 ? (
          <button 
            disabled={!canNext}
            onClick={onNext}
            className="px-6 py-3 rounded-2xl text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button 
            disabled={!canCreate}
            onClick={onCreate}
            className="px-6 py-3 rounded-2xl text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Create Group
          </button>
        )}
      </div>
    </div>
  );
}
