import { useState, useEffect, useCallback } from "react";
import { Todo, Subtask } from "@/types";
import { todoApi, subtaskApi, TodoResponse, SubtaskResponse, ApiError } from "@/services/api";

// 백엔드 응답을 프론트엔드 타입으로 변환
const convertTodo = (todo: TodoResponse): Todo => ({
  id: todo.id,
  text: todo.text,
  date: todo.date.split("T")[0], // YYYY-MM-DD만 추출
  completed: todo.completed,
  display_order: todo.display_order,
});

const convertSubtask = (subtask: SubtaskResponse): Subtask => ({
  id: subtask.id,
  text: subtask.text,
  completed: subtask.completed,
  display_order: subtask.display_order,
});

export const useTodosApi = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [subtasks, setSubtasks] = useState<{ [todoId: string | number]: Subtask[] }>({});
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true); // 초기 로딩만 true
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 로드
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoApi.getAll();

      const loadedTodos: Todo[] = [];
      const loadedSubtasks: { [key: string | number]: Subtask[] } = {};

      response.forEach((todoData) => {
        const todo = convertTodo(todoData);
        loadedTodos.push(todo);

        if (todoData.subtasks && todoData.subtasks.length > 0) {
          loadedSubtasks[todo.id] = todoData.subtasks.map(convertSubtask);
        }
      });

      setTodos(loadedTodos);
      setSubtasks(loadedSubtasks);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "데이터를 불러오는데 실패했습니다";
      setError(errorMessage);
      console.error("Failed to load todos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Todo 추가 (낙관적 업데이트)
  const addTodo = async (text: string, date: string) => {
    // 임시 Todo 생성 (즉시 UI 표시)
    const tempId = `temp-${Date.now()}`;
    const tempTodo: Todo = {
      id: tempId,
      text,
      date,
      completed: false,
      display_order: 0,
    };
    setTodos((prev) => [...prev, tempTodo]);

    try {
      setError(null);
      const response = await todoApi.create({ text, date });
      const newTodo = convertTodo(response);
      // 임시 Todo를 실제 Todo로 교체
      setTodos((prev) => prev.map((t) => (t.id === tempId ? newTodo : t)));
      return newTodo;
    } catch (err) {
      // 실패 시 임시 Todo 제거
      setTodos((prev) => prev.filter((t) => t.id !== tempId));
      const errorMessage = err instanceof ApiError ? err.message : "할일 추가에 실패했습니다";
      setError(errorMessage);
      throw err;
    }
  };

  // Todo 삭제 (낙관적 업데이트)
  const removeTodo = async (todoId: string | number) => {
    // 삭제할 Todo 백업
    const todoToDelete = todos.find((t) => t.id === todoId);
    const subtasksToDelete = subtasks[todoId];

    // 즉시 UI에서 제거
    setTodos((prev) => prev.filter((t) => t.id !== todoId));
    setSubtasks((prev) => {
      const newSubtasks = { ...prev };
      delete newSubtasks[todoId];
      return newSubtasks;
    });

    try {
      setError(null);
      await todoApi.delete(Number(todoId));
    } catch (err) {
      // 실패 시 복구
      if (todoToDelete) {
        setTodos((prev) => [...prev, todoToDelete]);
      }
      if (subtasksToDelete) {
        setSubtasks((prev) => ({ ...prev, [todoId]: subtasksToDelete }));
      }
      const errorMessage = err instanceof ApiError ? err.message : "할일 삭제에 실패했습니다";
      setError(errorMessage);
      throw err;
    }
  };

  // Todo 완료 토글 (낙관적 업데이트)
  const toggleComplete = async (todoId: string | number) => {
    // 즉시 UI 업데이트
    const previousTodos = todos;
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, completed: !t.completed } : t))
    );

    try {
      setError(null);
      const response = await todoApi.toggleComplete(Number(todoId));
      const updatedTodo = convertTodo(response);
      setTodos((prev) => prev.map((t) => (t.id === todoId ? updatedTodo : t)));
    } catch (err) {
      // 실패 시 롤백
      setTodos(previousTodos);
      const errorMessage = err instanceof ApiError ? err.message : "상태 변경에 실패했습니다";
      setError(errorMessage);
      throw err;
    }
  };

  // Subtask 추가 (낙관적 업데이트)
  const addSubtask = async (todoId: string | number, subtaskText: string) => {
    // 임시 Subtask 생성
    const tempId = `temp-subtask-${Date.now()}`;
    const tempSubtask: Subtask = {
      id: tempId,
      text: subtaskText,
      completed: false,
      display_order: 0,
    };
    setSubtasks((prev) => ({
      ...prev,
      [todoId]: [...(prev[todoId] || []), tempSubtask],
    }));

    try {
      setError(null);
      const response = await subtaskApi.create(Number(todoId), { text: subtaskText });
      const newSubtask = convertSubtask(response);
      // 임시 Subtask를 실제 Subtask로 교체
      setSubtasks((prev) => ({
        ...prev,
        [todoId]: (prev[todoId] || []).map((st) => (st.id === tempId ? newSubtask : st)),
      }));
      return newSubtask;
    } catch (err) {
      // 실패 시 임시 Subtask 제거
      setSubtasks((prev) => ({
        ...prev,
        [todoId]: (prev[todoId] || []).filter((st) => st.id !== tempId),
      }));
      const errorMessage = err instanceof ApiError ? err.message : "세부작업 추가에 실패했습니다";
      setError(errorMessage);
      throw err;
    }
  };

  // Subtask 삭제
  const removeSubtask = async (todoId: string | number, subtaskId: string | number) => {
    try {
      setError(null);
      await subtaskApi.delete(Number(subtaskId));
      setSubtasks((prev) => {
        const updatedSubtasks = prev[todoId]?.filter((st) => st.id !== subtaskId) || [];
        return { ...prev, [todoId]: updatedSubtasks };
      });
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "세부작업 삭제에 실패했습니다";
      setError(errorMessage);
      throw err;
    }
  };

  // Subtask 완료 토글 (낙관적 업데이트)
  const toggleSubtaskComplete = async (todoId: string | number, subtaskId: string | number) => {
    // 즉시 UI 업데이트
    setSubtasks((prev) => {
      const updatedSubtasks =
        prev[todoId]?.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        ) || [];
      return { ...prev, [todoId]: updatedSubtasks };
    });

    try {
      setError(null);
      const response = await subtaskApi.toggleComplete(Number(subtaskId));
      const updatedSubtask = convertSubtask(response);
      setSubtasks((prev) => {
        const updatedSubtasks =
          prev[todoId]?.map((st) => (st.id === subtaskId ? updatedSubtask : st)) || [];
        return { ...prev, [todoId]: updatedSubtasks };
      });
    } catch (err) {
      // 실패 시 롤백
      setSubtasks((prev) => {
        const updatedSubtasks =
          prev[todoId]?.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ) || [];
        return { ...prev, [todoId]: updatedSubtasks };
      });
      const errorMessage = err instanceof ApiError ? err.message : "상태 변경에 실패했습니다";
      setError(errorMessage);
      throw err;
    }
  };

  // Todo 날짜 변경 (낙관적 업데이트)
  const updateTodoDate = async (todoId: string | number, newDate: string) => {
    // 즉시 UI 업데이트
    const previousTodo = todos.find((t) => t.id === todoId);
    setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, date: newDate } : todo)));

    try {
      setError(null);
      const response = await todoApi.updateDate(Number(todoId), newDate);
      const updatedTodo = convertTodo(response);
      setTodos((prev) => prev.map((todo) => (todo.id === todoId ? updatedTodo : todo)));
    } catch (err) {
      // 실패 시 롤백
      if (previousTodo) {
        setTodos((prev) => prev.map((todo) => (todo.id === todoId ? previousTodo : todo)));
      }
      const errorMessage = err instanceof ApiError ? err.message : "날짜 변경에 실패했습니다";
      setError(errorMessage);
      throw err;
    }
  };

  // Todo 순서 변경 (디바운싱 + 낙관적 업데이트)
  const updateTodosOrder = async (newOrder: Todo[], dateString: string) => {
    // 즉시 UI 업데이트
    const previousTodos = todos;
    setTodos((prev) => {
      const others = prev.filter((t) => t.date !== dateString);
      const reorderedTodos = newOrder.map((todo, index) => ({
        ...todo,
        display_order: index,
      }));
      return [...others, ...reorderedTodos];
    });

    try {
      setError(null);
      // API 호출 (백그라운드)
      const reorderData = newOrder.map((todo, index) => ({
        id: Number(todo.id),
        display_order: index,
      }));

      await todoApi.reorder(reorderData);
    } catch (err) {
      // 실패 시 롤백
      setTodos(previousTodos);
      const errorMessage = err instanceof ApiError ? err.message : "순서 변경에 실패했습니다";
      setError(errorMessage);
      // 에러는 조용히 처리 (사용자 경험 방해 최소화)
      console.error("Failed to reorder todos:", err);
    }
  };

  // 에러 초기화
  const clearError = () => {
    setError(null);
  };

  return {
    todos,
    subtasks,
    selectedTodo,
    setSelectedTodo,
    loading,
    error,
    clearError,
    addTodo,
    removeTodo,
    toggleComplete,
    addSubtask,
    removeSubtask,
    toggleSubtaskComplete,
    updateTodoDate,
    updateTodosOrder,
    reload: loadTodos,
  };
};
