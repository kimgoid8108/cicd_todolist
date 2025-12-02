"use client";

import SubtaskInput from "./SubtaskInput";
import SubtaskList from "./SubTaskList";

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Todo {
  id: string;
  text: string;
  date: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  isDarkMode: boolean;
  subtasks: Subtask[];
  onToggleComplete: () => void;
  onRemove: () => void;
  onAddSubtask: (subtask: string) => void;
  onRemoveSubtask: (subtaskId: string) => void;
  onToggleSubtaskComplete: (subtaskId: string) => void;
}

export default function TodoItem({ todo, isDarkMode, subtasks, onToggleComplete, onRemove, onAddSubtask, onRemoveSubtask, onToggleSubtaskComplete }: TodoItemProps) {
  const completedSubtasksCount = subtasks.filter((st) => st.completed).length;
  const canDelete = subtasks.length === 0 || subtasks.length === completedSubtasksCount;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <li
      className="flex flex-col p-2 mb-2 rounded shadow transition-colors"
      style={{
        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
      }}>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span
            className={todo.completed ? "line-through" : ""}
            style={{
              color: todo.completed ? (isDarkMode ? "#9ca3af" : "#6b7280") : isDarkMode ? "#ffffff" : "#111827",
            }}>
            {todo.text}
          </span>
          <span
            className="text-xs mt-1"
            style={{
              color: isDarkMode ? "#9ca3af" : "#6b7280",
            }}>
            📅 {formatDate(todo.date)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggleComplete}
            className="hover:opacity-80"
            style={{
              color: isDarkMode ? "#34d399" : "#10b981",
              opacity: !canDelete ? 0.5 : 1,
              cursor: !canDelete ? "not-allowed" : "pointer",
            }}
            disabled={!canDelete}>
            {todo.completed ? "비완료" : "완료"}
          </button>
          <button
            onClick={onRemove}
            className="hover:opacity-80"
            style={{
              color: isDarkMode ? "#f87171" : "#ef4444",
              opacity: !canDelete ? 0.5 : 1,
              cursor: !canDelete ? "not-allowed" : "pointer",
            }}
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
