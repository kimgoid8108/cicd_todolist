"use client";

import { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarDay from "./CalendarDay";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Todo, Subtask, DayInfo } from "@/types";
import { generateWeekDays, getWeekRange } from "@/utils/date";
import { createDragHandler } from "@/utils/dragHandlers";

interface CalendarProps {
  isDarkMode: boolean;
  todos: Todo[];
  subtasks: { [todoId: string | number]: Subtask[] };
  toggleComplete: (todoId: string | number) => void;
  removeTodo: (todoId: string | number) => void;
  toggleSubtaskComplete: (todoId: string | number, subtaskId: string | number) => void;
  updateTodoDate: (todoId: string | number, newDate: string) => void;
  updateTodosOrder: (newOrder: Todo[], dateString: string) => void;
  onTodoClick: (todo: Todo) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export default function Calendar({
  isDarkMode,
  todos,
  subtasks,
  toggleComplete,
  removeTodo,
  toggleSubtaskComplete,
  updateTodoDate,
  updateTodosOrder,
  onTodoClick,
  searchQuery,
  setSearchQuery,
}: CalendarProps) {
  const [weekDays, setWeekDays] = useState<DayInfo[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    const days = generateWeekDays(currentWeekStart, DAY_NAMES);
    setWeekDays(days);
  }, [currentWeekStart]);

  const getTodosForDate = (dateString: string) => todos.filter((todo) => todo.date === dateString);
  const handleDragEnd = createDragHandler(todos, getTodosForDate, updateTodoDate, updateTodosOrder);

  const navigateWeek = (days: number) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + days);
    setCurrentWeekStart(newDate);
  };

  return (
    <div style={{ color: isDarkMode ? "#ffffff" : "#111827" }}>
      <CalendarHeader
        isDarkMode={isDarkMode}
        weekRange={getWeekRange(weekDays)}
        onPreviousWeek={() => navigateWeek(-7)}
        onToday={() => setCurrentWeekStart(new Date())}
        onNextWeek={() => navigateWeek(7)}
      />

      {/* 검색창 */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Todo 검색..."
          className="w-full p-3 rounded-lg border-2 transition-colors"
          style={{
            backgroundColor: isDarkMode ? "#374151" : "#ffffff",
            borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
            color: isDarkMode ? "#ffffff" : "#111827",
          }}
        />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <CalendarDay
              key={day.dateString}
              day={day}
              isDarkMode={isDarkMode}
              todos={getTodosForDate(day.dateString)}
              subtasks={subtasks}
              onTodoClick={onTodoClick}
              onToggleComplete={toggleComplete}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
