"use client";

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface SubtaskListProps {
  isDarkMode: boolean;
  subtasks: Subtask[];
  onRemoveSubtask: (subtaskId: string) => void;
  onToggleSubtaskComplete: (subtaskId: string) => void;
}

export default function SubtaskList({ isDarkMode, subtasks, onRemoveSubtask, onToggleSubtaskComplete }: SubtaskListProps) {
  return (
    <ul className="mt-2 pl-4 list-disc">
      {subtasks.map((subtask) => (
        <li
          key={subtask.id}
          className="flex justify-between items-center"
          style={{
            color: isDarkMode ? "#d1d5db" : "#374151",
          }}>
          <span
            className={subtask.completed ? "line-through" : ""}
            style={{
              color: subtask.completed ? (isDarkMode ? "#9ca3af" : "#6b7280") : "inherit",
            }}>
            {subtask.text}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onToggleSubtaskComplete(subtask.id)}
              className="hover:opacity-80"
              style={{
                color: isDarkMode ? "#34d399" : "#10b981",
              }}>
              {subtask.completed ? "비완료" : "완료"}
            </button>
            <button
              onClick={() => onRemoveSubtask(subtask.id)}
              className="hover:opacity-80"
              style={{
                color: isDarkMode ? "#f87171" : "#ef4444",
              }}>
              삭제
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
