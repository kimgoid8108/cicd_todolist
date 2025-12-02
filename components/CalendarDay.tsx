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

interface DayInfo {
  date: Date;
  dayOfWeek: string;
  dayNumber: number;
  month: number;
  isToday: boolean;
  dateString: string;
}

interface CalendarDayProps {
  day: DayInfo;
  isDarkMode: boolean;
  todos: Todo[];
  subtasks: { [todoId: string]: Subtask[] };
  onTodoClick: (todo: Todo) => void;
  onToggleComplete: (todoId: string) => void;
}

export default function CalendarDay({ day, isDarkMode, todos, subtasks, onTodoClick, onToggleComplete }: CalendarDayProps) {
  return (
    <div
      className="flex flex-col rounded-lg transition-all"
      style={{
        backgroundColor: day.isToday ? "#3b82f6" : isDarkMode ? "#1f2937" : "#ffffff",
        border: day.isToday ? "none" : `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
        minHeight: "200px",
      }}>
      <div
        className="p-2 border-b"
        style={{
          borderColor: day.isToday ? "rgba(255,255,255,0.2)" : isDarkMode ? "#374151" : "#e5e7eb",
        }}>
        <div
          className="text-sm font-medium mb-1 text-center"
          style={{
            color:
              day.dayOfWeek === "일"
                ? day.isToday
                  ? "#ffffff"
                  : "#ef4444"
                : day.dayOfWeek === "토"
                ? day.isToday
                  ? "#ffffff"
                  : "#3b82f6"
                : day.isToday
                ? "#ffffff"
                : isDarkMode
                ? "#ffffff"
                : "#111827",
          }}>
          {day.dayOfWeek}
        </div>
        <div
          className="text-xl font-bold text-center"
          style={{
            color: day.isToday ? "#ffffff" : "inherit",
          }}>
          {day.dayNumber}
        </div>
        {day.isToday && <div className="text-xs mt-1 font-semibold text-center text-white">TODAY</div>}
      </div>

      <div className="p-2 flex-1 overflow-y-auto">
        {todos.map((todo) => {
          const todoSubtasks = subtasks[todo.id] || [];
          const completedCount = todoSubtasks.filter((st) => st.completed).length;
          const totalCount = todoSubtasks.length;

          return (
            <div
              key={todo.id}
              onClick={() => onTodoClick(todo)}
              className="mb-2 p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                border: `1px solid ${isDarkMode ? "#4b5563" : "#e5e7eb"}`,
              }}>
              <div className="flex items-start justify-between gap-1">
                <span
                  className={todo.completed ? "line-through flex-1" : "flex-1"}
                  style={{
                    color: todo.completed ? (isDarkMode ? "#9ca3af" : "#6b7280") : isDarkMode ? "#ffffff" : "#111827",
                    wordBreak: "break-word",
                  }}>
                  {todo.text}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(todo.id);
                  }}
                  className="text-xs px-1 hover:opacity-80"
                  style={{
                    color: isDarkMode ? "#34d399" : "#10b981",
                  }}>
                  ✓
                </button>
              </div>
              {totalCount > 0 && (
                <div
                  className="text-xs mt-1"
                  style={{
                    color: isDarkMode ? "#9ca3af" : "#6b7280",
                  }}>
                  {completedCount}/{totalCount} 완료
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
