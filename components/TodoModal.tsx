"use client";

interface Todo {
  id: string;
  text: string;
  date: string;
  completed: boolean;
}

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoModalProps {
  isDarkMode: boolean;
  todo: Todo;
  subtasks: Subtask[];
  onClose: () => void;
  onToggleSubtask: (subtaskId: string) => void;
}

export default function TodoModal({ isDarkMode, todo, subtasks, onClose, onToggleSubtask }: TodoModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={onClose}>
      <div
        className="rounded-lg p-6 max-w-md w-full mx-4"
        style={{
          backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
          border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg font-bold"
            style={{
              color: isDarkMode ? "#ffffff" : "#111827",
            }}>
            {todo.text}
          </h3>
          <button
            onClick={onClose}
            className="text-2xl hover:opacity-70"
            style={{
              color: isDarkMode ? "#9ca3af" : "#6b7280",
            }}>
            ×
          </button>
        </div>

        <div
          className="mb-4 text-sm"
          style={{
            color: isDarkMode ? "#9ca3af" : "#6b7280",
          }}>
          📅 {todo.date}
        </div>

        <div className="mb-2">
          <h4
            className="font-semibold mb-2"
            style={{
              color: isDarkMode ? "#ffffff" : "#111827",
            }}>
            세부 작업
          </h4>
          {subtasks && subtasks.length > 0 ? (
            <div className="space-y-2">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  onClick={() => onToggleSubtask(subtask.id)}
                  className="flex items-center gap-2 p-2 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                  }}>
                  <input type="checkbox" checked={subtask.completed} onChange={() => {}} className="cursor-pointer" />
                  <span
                    className={subtask.completed ? "line-through flex-1" : "flex-1"}
                    style={{
                      color: subtask.completed ? (isDarkMode ? "#9ca3af" : "#6b7280") : isDarkMode ? "#ffffff" : "#111827",
                    }}>
                    {subtask.text}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p
              style={{
                color: isDarkMode ? "#9ca3af" : "#6b7280",
              }}>
              세부 작업이 없습니다.
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 rounded transition-colors hover:opacity-90"
          style={{
            backgroundColor: "#3b82f6",
            color: "#ffffff",
          }}>
          닫기
        </button>
      </div>
    </div>
  );
}
