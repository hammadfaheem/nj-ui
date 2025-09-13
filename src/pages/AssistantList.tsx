import React from "react";
import { Assistant } from "../types/api";
import { Trash2, Edit } from "lucide-react";

interface AssistantListProps {
  assistants: Assistant[];
  loading: boolean;
  selectedAssistant: Assistant | null;
  onSelect: (assistant: Assistant) => void;
  onDelete: (assistantId: string) => void;
  onEdit: (assistant: Assistant) => void;
}

const AssistantList: React.FC<AssistantListProps> = ({
  assistants,
  loading,
  selectedAssistant,
  onSelect,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="p-4">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Your AI Assistants
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
        </div>
      ) : assistants.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">🤖</div>
          <h3 className="text-xs font-medium text-gray-900 dark:text-white">
            No assistants
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Create your first assistant
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {assistants.map((assistant) => (
            <div
              key={assistant.assistant_id}
              className={`border rounded-md p-2 cursor-pointer transition-all hover:shadow-sm ${
                selectedAssistant?.assistant_id === assistant.assistant_id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              onClick={() => onSelect(assistant)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                    <span className="text-xs">🤖</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {assistant.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedAssistant?.assistant_id ===
                    assistant.assistant_id && (
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(assistant);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors rounded"
                    title="Edit assistant"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${assistant.name}"? This action cannot be undone.`
                        )
                      ) {
                        onDelete(assistant.assistant_id!);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors rounded"
                    title="Delete assistant"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssistantList;
