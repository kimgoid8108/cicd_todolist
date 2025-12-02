"use client";

import { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarDay from "./CalendarDay";
import TodoModal from "./TodoModal";

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

interface CalendarProps {
  isDarkMode: boolean;
  todos: Todo[];
  subtasks: { [todoId: string]: Subtask[] };
  toggleComplete: (todoId: string) => void;
  removeTodo: (todoId: string) => void;
  toggleSubtaskComplete: (todoId: string, subtaskId: string) => void;
}

interface DayInfo {
  date: Date;
  dayOfWeek: string;
  dayNumber: number;
  month: number;
  isToday: boolean;
  dateString: string;
}

export default function Calendar({ isDarkMode, todos, subtasks, toggleComplete, removeTodo, toggleSubtaskComplete }: CalendarProps) {
  const [weekDays, setWeekDays] = useState<DayInfo[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  useEffect(() => {
    generateWeekDays(currentWeekStart);
  }, [currentWeekStart]);

  const generateWeekDays = (startDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sunday = new Date(startDate);
    const day = sunday.getDay();
    sunday.setDate(sunday.getDate() - day);

    const days: DayInfo[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);

      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);

      days.push({
        date: date,
        dayOfWeek: dayNames[date.getDay()],
        dayNumber: date.getDate(),
        month: date.getMonth() + 1,
        isToday: compareDate.getTime() === today.getTime(),
        dateString: date.toISOString().split("T")[0],
      });
    }
    setWeekDays(days);
  };

  const getTodosForDate = (dateString: string) => {
    return todos.filter((todo) => todo.date === dateString);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    setCurrentWeekStart(new Date());
  };

  const getWeekRange = () => {
    if (weekDays.length === 0) return "";
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    const firstYear = firstDay.date.getFullYear();
    const lastYear = lastDay.date.getFullYear();

    if (firstYear !== lastYear) {
      return `${firstYear}년 ${firstDay.month}월 ${firstDay.dayNumber}일 - ${lastYear}년 ${lastDay.month}월 ${lastDay.dayNumber}일`;
    } else if (firstDay.month !== lastDay.month) {
      return `${firstYear}년 ${firstDay.month}월 ${firstDay.dayNumber}일 - ${lastDay.month}월 ${lastDay.dayNumber}일`;
    } else {
      return `${firstYear}년 ${firstDay.month}월 ${firstDay.dayNumber}일 - ${lastDay.dayNumber}일`;
    }
  };

  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const closeModal = () => {
    setSelectedTodo(null);
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    if (selectedTodo) {
      toggleSubtaskComplete(selectedTodo.id, subtaskId);

      const todoSubtasks = subtasks[selectedTodo.id] || [];
      const updatedSubtasks = todoSubtasks.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st));

      const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);

      if (allCompleted && !selectedTodo.completed) {
        toggleComplete(selectedTodo.id);
      } else if (!allCompleted && selectedTodo.completed) {
        toggleComplete(selectedTodo.id);
      }
    }
  };

  return (
    <div style={{ color: isDarkMode ? "#ffffff" : "#111827" }}>
      <CalendarHeader isDarkMode={isDarkMode} weekRange={getWeekRange()} onPreviousWeek={goToPreviousWeek} onToday={goToToday} onNextWeek={goToNextWeek} />

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayTodos = getTodosForDate(day.dateString);

          return <CalendarDay key={index} day={day} isDarkMode={isDarkMode} todos={dayTodos} subtasks={subtasks} onTodoClick={handleTodoClick} onToggleComplete={toggleComplete} />;
        })}
      </div>

      {selectedTodo && <TodoModal isDarkMode={isDarkMode} todo={selectedTodo} subtasks={subtasks[selectedTodo.id] || []} onClose={closeModal} onToggleSubtask={handleSubtaskToggle} />}
    </div>
  );
}
