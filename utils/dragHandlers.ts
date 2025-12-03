import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Todo } from "@/types";

export const createDragHandler = (
  todos: Todo[],
  getTodosForDate: (dateString: string) => Todo[],
  updateTodoDate: (todoId: string, newDate: string) => void,
  updateTodosOrder: (newOrder: Todo[], dateString: string) => void
) => {
  return (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const activeId = active.id as string;
    const draggedTodo = todos.find((t) => t.id === activeId);
    if (!draggedTodo) return;

    const oldDate = draggedTodo.date;
    const overTodo = todos.find((t) => t.id === over.id);
    const overDate = overTodo ? overTodo.date : (over.id as string);

    // 다른 날짜로 이동
    if (oldDate !== overDate && /^\d{4}-\d{2}-\d{2}$/.test(overDate)) {
      updateTodoDate(activeId, overDate);
      return;
    }

    // 같은 날짜 내에서 순서 변경
    const dayTodos = getTodosForDate(oldDate);
    const oldIndex = dayTodos.findIndex((t) => t.id === activeId);
    if (oldIndex === -1) return;

    if (overTodo) {
      const newIndex = dayTodos.findIndex((t) => t.id === over.id);
      if (newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(dayTodos, oldIndex, newIndex);
        updateTodosOrder(reordered, oldDate);
      }
    } else if (oldIndex !== dayTodos.length - 1) {
      const reordered = arrayMove(dayTodos, oldIndex, dayTodos.length - 1);
      updateTodosOrder(reordered, oldDate);
    }
  };
};
