"use client";

import SubtaskInput from "./SubtaskInput";
import SubtaskList from "./SubTaskList";
import { Todo, Subtask } from "@/types";
import { formatDate } from "@/utils/date";
import { getTextColor, getBgColor } from "@/utils/styles";

interface TodoItemProps {
  todo: Todo;
  isDarkMode: boolean;
  subtasks: Subtask[];
  onToggleComplete: () => void;
  onRemove: () => void;
  onAddSubtask: (subtask: string) => void;
  onRemoveSubtask: (subtaskId: string | number) => void;
  onToggleSubtaskComplete: (subtaskId: string | number) => void;
}

export default function TodoItem({ todo, isDarkMode, subtasks, onToggleComplete, onRemove, onAddSubtask, onRemoveSubtask, onToggleSubtaskComplete }: TodoItemProps) {
  const completedSubtasksCount = subtasks.filter((st) => st.completed).length;
  const canDelete = subtasks.length === 0 || subtasks.length === completedSubtasksCount;
  const buttonOpacity = !canDelete ? 0.5 : 1;
  const buttonCursor = !canDelete ? "not-allowed" : "pointer";

  return (
    <li className="flex flex-col p-2 mb-2 rounded shadow transition-colors" style={{ backgroundColor: getBgColor(isDarkMode) }}>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className={todo.completed ? "line-through" : ""} style={{ color: getTextColor(isDarkMode, todo.completed) }}>
            {todo.text}
          </span>
          <span className="text-xs mt-1" style={{ color: getTextColor(isDarkMode, true) }}>
            📅 {formatDate(todo.date)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggleComplete}
            className="hover:opacity-80"
            style={{ color: isDarkMode ? "#34d399" : "#10b981", opacity: buttonOpacity, cursor: buttonCursor }}
            disabled={!canDelete}>
            {todo.completed ? "비완료" : "완료"}
          </button>
          <button
            onClick={onRemove}
            className="hover:opacity-80"
            style={{ color: isDarkMode ? "#f87171" : "#ef4444", opacity: buttonOpacity, cursor: buttonCursor }}
            disabled={!canDelete}>
            🗑️
          </button>
        </div>
      </div>
      <div className="mt-2">
        <SubtaskInput isDarkMode={isDarkMode} onAddSubtask={onAddSubtask} />
        <SubtaskList isDarkMode={isDarkMode} subtasks={subtasks} onRemoveSubtask={onRemoveSubtask} onToggleSubtaskComplete={onToggleSubtaskComplete} />
      </div>
    </li>
  );
}
