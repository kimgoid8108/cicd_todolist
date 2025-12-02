"use client";

import { useState, useRef } from "react";

interface TodoInputProps {
  isDarkMode: boolean;
  addTodo: (text: string, date: string) => void;
}

export default function TodoInput({ isDarkMode, addTodo }: TodoInputProps) {
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = () => {
    if (newTodo.trim() !== "" && selectedDate) {
      addTodo(newTodo, selectedDate);
      setNewTodo("");
      setSelectedDate("");
    }
  };

  const handleDateClick = () => {
    if (isDatePickerOpen) {
      dateInputRef.current?.blur();
      setIsDatePickerOpen(false);
    } else {
      dateInputRef.current?.showPicker();
      setIsDatePickerOpen(true);
    }
  };

  // 오늘 날짜를 YYYY-MM-DD 형식으로
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && selectedDate) {
              handleAddTodo();
            }
          }}
          placeholder="할 일을 입력해주세요!"
          className="border p-2 rounded w-full transition-colors"
          style={{
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#111827",
            borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
          }}
        />
        <input
          ref={dateInputRef}
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          onClick={handleDateClick}
          onBlur={() => setIsDatePickerOpen(false)}
          min={today}
          className="border p-2 rounded transition-colors cursor-pointer"
          style={{
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#111827",
            borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
            colorScheme: isDarkMode ? "dark" : "light",
          }}
        />
        <button
          onClick={handleAddTodo}
          disabled={!newTodo.trim() || !selectedDate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center transition-opacity"
          style={{
            opacity: !newTodo.trim() || !selectedDate ? 0.5 : 1,
            cursor: !newTodo.trim() || !selectedDate ? "not-allowed" : "pointer",
          }}>
          <span>추가</span>
        </button>
      </div>
    </div>
  );
}
