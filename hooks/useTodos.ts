import { useState } from "react";
import { Todo, Subtask } from "@/types";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [subtasks, setSubtasks] = useState<{ [todoId: string]: Subtask[] }>({});
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const addTodo = (text: string, date: string) => {
    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random()}`,
      text,
      date,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const removeTodo = (todoId: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== todoId));
    setSubtasks((prev) => {
      const newSubtasks = { ...prev };
      delete newSubtasks[todoId];
      return newSubtasks;
    });
  };

  const toggleComplete = (todoId: string) => {
    setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, completed: !t.completed } : t)));
  };

  const addSubtask = (todoId: string, subtaskText: string) => {
    const newSubtask: Subtask = {
      id: `${Date.now()}-${Math.random()}`,
      text: subtaskText,
      completed: false,
    };
    setSubtasks((prev) => ({
      ...prev,
      [todoId]: [...(prev[todoId] || []), newSubtask],
    }));
  };

  const removeSubtask = (todoId: string, subtaskId: string) => {
    setSubtasks((prev) => {
      const updatedSubtasks = prev[todoId]?.filter((st) => st.id !== subtaskId) || [];
      return { ...prev, [todoId]: updatedSubtasks };
    });
  };

  const toggleSubtaskComplete = (todoId: string, subtaskId: string) => {
    setSubtasks((prev) => {
      const updatedSubtasks =
        prev[todoId]?.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st)) || [];
      return { ...prev, [todoId]: updatedSubtasks };
    });
  };

  const updateTodoDate = (todoId: string, newDate: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, date: newDate } : todo)));
  };

  const updateTodosOrder = (newOrder: Todo[], dateString: string) => {
    setTodos((prev) => {
      const others = prev.filter((t) => t.date !== dateString);
      const reorderedTodos = newOrder.map((todo) => {
        const existingTodo = prev.find((t) => t.id === todo.id);
        return existingTodo ? existingTodo : todo;
      });
      return [...others, ...reorderedTodos];
    });
  };

  return {
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
  };
};
