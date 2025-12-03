"use client";

import { useState } from "react";
import Header from "@/components/Header";
import TodoList from "@/components/TodoList";
import Calendar from "@/components/Calendar";
import TodoModal from "@/components/TodoModal";
import { useTodosApi } from "@/hooks/useTodosApi";
import { getSecondaryBgColor } from "@/utils/styles";
export default function Home() {
  const [activeTab, setActiveTab] = useState("todo");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    todos,
    subtasks,
    selectedTodo,
    setSelectedTodo,
    addTodo,
    removeTodo,
    toggleComplete,
    addSubtask,
    removeSubtask,
    toggleSubtaskComplete,
    updateTodoDate,
    updateTodosOrder,
    loading,
    error,
    clearError,
  } = useTodosApi();

  // 검색 필터링
  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen flex-col p-4 transition-colors overflow-hidden" style={{ backgroundColor: getSecondaryBgColor(isDarkMode) }}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 에러 표시 */}
      {error && (
        <div
          className="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 cursor-pointer hover:bg-red-200 transition-colors"
          onClick={clearError}
        >
          ⚠️ {error} (클릭하여 닫기)
        </div>
      )}

      {/* 초기 로딩만 표시 */}
      {loading && todos.length === 0 && (
        <div className="mb-4 p-3 rounded-lg bg-blue-100 border border-blue-400 text-blue-700">
          ⏳ 데이터를 불러오는 중...
        </div>
      )}

      <div className="relative flex-1 overflow-hidden w-full">
        <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: activeTab === "todo" ? "translateX(0)" : "translateX(-100%)" }}>
          <div className="min-w-full h-full">
            <TodoList
              isDarkMode={isDarkMode}
              todos={filteredTodos}
              subtasks={subtasks}
              addTodo={addTodo}
              removeTodo={removeTodo}
              toggleComplete={toggleComplete}
              addSubtask={addSubtask}
              removeSubtask={removeSubtask}
              toggleSubtaskComplete={toggleSubtaskComplete}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className="min-w-full h-full">
            <Calendar
              isDarkMode={isDarkMode}
              todos={filteredTodos}
              subtasks={subtasks}
              toggleComplete={toggleComplete}
              removeTodo={removeTodo}
              toggleSubtaskComplete={toggleSubtaskComplete}
              updateTodoDate={updateTodoDate}
              updateTodosOrder={updateTodosOrder}
              onTodoClick={setSelectedTodo}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal
          isDarkMode={isDarkMode}
          todo={selectedTodo}
          subtasks={subtasks[selectedTodo.id] || []}
          onClose={() => setSelectedTodo(null)}
          onToggleSubtask={(sid) => toggleSubtaskComplete(selectedTodo.id, sid)}
        />
      )}
    </div>
  );
}
