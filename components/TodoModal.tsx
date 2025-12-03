"use client";

import { Todo, Subtask } from "@/types";
import { getTextColor, getBgColor, getBorderColor, getSecondaryBgColor } from "@/utils/styles";

interface TodoModalProps {
  isDarkMode: boolean;
  todo: Todo;
  subtasks: Subtask[];
  onClose: () => void;
  onToggleSubtask: (subtaskId: string | number) => void;
}

export default function TodoModal({ isDarkMode, todo, subtasks, onClose, onToggleSubtask }: TodoModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, position: "fixed" }} onClick={onClose}>
      <div
        className="rounded-lg p-6 max-w-md w-full mx-4"
        style={{ backgroundColor: getBgColor(isDarkMode), border: `1px solid ${getBorderColor(isDarkMode)}`, maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: getTextColor(isDarkMode) }}>
            {todo.text}
          </h3>
          <button onClick={onClose} className="text-2xl hover:opacity-70" style={{ color: getTextColor(isDarkMode, true) }}>
            ×
          </button>
        </div>

        <div className="mb-4 text-sm" style={{ color: getTextColor(isDarkMode, true) }}>
          📅 {todo.date}
        </div>

        <div className="mb-2">
          <h4 className="font-semibold mb-2" style={{ color: getTextColor(isDarkMode) }}>
            세부 작업
          </h4>
          {subtasks && subtasks.length > 0 ? (
            <div className="space-y-2">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  onClick={() => onToggleSubtask(subtask.id)}
                  className="flex items-center gap-2 p-2 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: getSecondaryBgColor(isDarkMode) }}>
                  <input type="checkbox" checked={subtask.completed} onChange={() => {}} className="cursor-pointer" />
                  <span className={subtask.completed ? "line-through flex-1" : "flex-1"} style={{ color: getTextColor(isDarkMode, subtask.completed) }}>
                    {subtask.text}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: getTextColor(isDarkMode, true) }}>세부 작업이 없습니다.</p>
          )}
        </div>

        <button onClick={onClose} className="w-full mt-4 py-2 rounded transition-colors hover:opacity-90" style={{ backgroundColor: "#3b82f6", color: "#ffffff" }}>
          닫기
        </button>
      </div>
    </div>
  );
}
