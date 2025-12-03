"use client";

import { Subtask } from "@/types";
import { getTextColor } from "@/utils/styles";

interface SubtaskListProps {
  isDarkMode: boolean;
  subtasks: Subtask[];
  onRemoveSubtask: (subtaskId: string | number) => void;
  onToggleSubtaskComplete: (subtaskId: string | number) => void;
}

export default function SubtaskList({ isDarkMode, subtasks, onRemoveSubtask, onToggleSubtaskComplete }: SubtaskListProps) {
  return (
    <ul className="mt-2 pl-4 list-disc">
      {subtasks.map((subtask) => (
        <li key={subtask.id} className="flex justify-between items-center" style={{ color: getTextColor(isDarkMode, false) }}>
          <span className={subtask.completed ? "line-through" : ""} style={{ color: subtask.completed ? getTextColor(isDarkMode, true) : "inherit" }}>
            {subtask.text}
          </span>
          <div className="flex gap-2">
            <button onClick={() => onToggleSubtaskComplete(subtask.id)} className="hover:opacity-80" style={{ color: isDarkMode ? "#34d399" : "#10b981" }}>
              {subtask.completed ? "비완료" : "완료"}
            </button>
            <button onClick={() => onRemoveSubtask(subtask.id)} className="hover:opacity-80" style={{ color: isDarkMode ? "#f87171" : "#ef4444" }}>
              삭제
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
