"use client";

import { useState } from "react";
import Header from "@/components/Header";
import TodoList from "@/components/TodoList";
import Calendar from "@/components/Calendar";

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Todo {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD 형식
  completed: boolean;
}

interface CalendarProps {
  isDarkMode: boolean;
  todos: Todo[];
  subtasks: { [todoId: string]: Subtask[] };
  toggleComplete: (todoId: string) => void;
  removeTodo: (todoId: string) => void;
  toggleSubtaskComplete: (todoId: string, subtaskId: string) => void; // 이 줄이 있는지 확인
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [subtasks, setSubtasks] = useState<{ [todoId: string]: Subtask[] }>({});
  const [activeTab, setActiveTab] = useState("todo");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const addTodo = (text: string, date: string) => {
    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random()}`,
      text,
      date,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const removeTodo = (todoId: string) => {
    setTodos(todos.filter((t) => t.id !== todoId));
    setSubtasks((prev) => {
      const newSubtasks = { ...prev };
      delete newSubtasks[todoId];
      return newSubtasks;
    });
  };

  const toggleComplete = (todoId: string) => {
    setTodos(todos.map((t) => (t.id === todoId ? { ...t, completed: !t.completed } : t)));
  };

  const addSubtask = (todoId: string, subtaskText: string) => {
    const newSubtask: Subtask = {
      id: `${Date.now()}-${Math.random()}`,
      text: subtaskText,
      completed: false,
    };
    setSubtasks({
      ...subtasks,
      [todoId]: [...(subtasks[todoId] || []), newSubtask],
    });
  };

  const removeSubtask = (todoId: string, subtaskId: string) => {
    const updatedSubtasks = subtasks[todoId]?.filter((st) => st.id !== subtaskId) || [];
    setSubtasks({
      ...subtasks,
      [todoId]: updatedSubtasks,
    });
  };

  const toggleSubtaskComplete = (todoId: string, subtaskId: string) => {
    const updatedSubtasks = subtasks[todoId]?.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st)) || [];
    setSubtasks({
      ...subtasks,
      [todoId]: updatedSubtasks,
    });
  };

  return (
    <div
      className="flex min-h-screen flex-col p-4 transition-colors"
      style={{
        backgroundColor: isDarkMode ? "#111827" : "#f3f4f6",
      }}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "todo" && (
        <TodoList
          isDarkMode={isDarkMode}
          todos={todos}
          subtasks={subtasks}
          addTodo={addTodo}
          removeTodo={removeTodo}
          toggleComplete={toggleComplete}
          addSubtask={addSubtask}
          removeSubtask={removeSubtask}
          toggleSubtaskComplete={toggleSubtaskComplete}
        />
      )}

      {activeTab === "calendar" && (
        <Calendar isDarkMode={isDarkMode} todos={todos} subtasks={subtasks} toggleComplete={toggleComplete} removeTodo={removeTodo} toggleSubtaskComplete={toggleSubtaskComplete} />
      )}
    </div>
  );
}
