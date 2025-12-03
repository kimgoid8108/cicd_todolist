"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableTodo from "./DraggableTodo";
import { Todo, Subtask, DayInfo } from "@/types";
import { getDayOfWeekColor, getBgColor, getBorderColor } from "@/utils/styles";

interface CalendarDayProps {
  day: DayInfo;
  isDarkMode: boolean;
  todos: Todo[];
  subtasks: { [todoId: string | number]: Subtask[] };
  onTodoClick: (todo: Todo) => void;
  onToggleComplete: (todoId: string | number) => void;
}

export default function CalendarDay({ day, isDarkMode, todos, subtasks, onTodoClick, onToggleComplete }: CalendarDayProps) {
  const { setNodeRef } = useDroppable({ id: day.dateString });

  const dayBgColor = day.isToday ? "#3b82f6" : getBgColor(isDarkMode);
  const dayBorder = day.isToday ? "none" : `1px solid ${getBorderColor(isDarkMode)}`;
  const headerBorderColor = day.isToday ? "rgba(255,255,255,0.2)" : getBorderColor(isDarkMode);
  const dayOfWeekColor = getDayOfWeekColor(day.dayOfWeek, day.isToday, isDarkMode);

  return (
    <div ref={setNodeRef} className="flex flex-col rounded-lg transition-all" style={{ backgroundColor: dayBgColor, border: dayBorder, minHeight: "200px" }}>
      <div className="p-2 border-b" style={{ borderColor: headerBorderColor }}>
        <div className="text-sm font-medium mb-1 text-center" style={{ color: dayOfWeekColor }}>
          {day.dayOfWeek}
        </div>
        <div className="text-xs text-center mb-1" style={{ color: day.isToday ? "rgba(255,255,255,0.8)" : isDarkMode ? "#9ca3af" : "#6b7280" }}>
          {day.month}월
        </div>
        <div className="text-xl font-bold text-center" style={{ color: day.isToday ? "#ffffff" : "inherit" }}>
          {day.dayNumber}
        </div>
        {day.isToday && <div className="text-xs mt-1 font-semibold text-center text-white">TODAY</div>}
      </div>

      <div className="p-2 flex-1 overflow-y-auto">
        <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {todos.map((todo) => (
            <DraggableTodo
              key={todo.id}
              todo={todo}
              isDarkMode={isDarkMode}
              subtasks={subtasks[todo.id] || []}
              onTodoClick={onTodoClick}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
