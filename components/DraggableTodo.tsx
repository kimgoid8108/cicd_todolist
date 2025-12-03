"use client";

import { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo, Subtask } from "@/types";
import { getTextColor, getSecondaryBgColor, getBorderColor } from "@/utils/styles";

interface DraggableTodoProps {
  todo: Todo;
  isDarkMode: boolean;
  subtasks: Subtask[];
  onTodoClick: (todo: Todo) => void;
  onToggleComplete: (todoId: string) => void;
}

export default function DraggableTodo({ todo, isDarkMode, subtasks, onTodoClick, onToggleComplete }: DraggableTodoProps) {
  const completedCount = subtasks.filter((s) => s.completed).length;
  const total = subtasks.length;
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
    data: {
      type: "todo",
      todoId: todo.id,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: getSecondaryBgColor(isDarkMode),
    border: `1px solid ${getBorderColor(isDarkMode)}`,
  };

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaX = Math.abs(x2 - x1);
    const deltaY = Math.abs(y2 - y1);
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStartPos.current && !isDragging) {
      const distance = calculateDistance(e.clientX, e.clientY, dragStartPos.current.x, dragStartPos.current.y);
      if (distance < 5) {
        e.stopPropagation();
        e.preventDefault();
        setTimeout(() => {
          if (!isDragging) onTodoClick(todo);
        }, 10);
      }
    }
    dragStartPos.current = null;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      if (dragStartPos.current) {
        const distance = calculateDistance(e.clientX, e.clientY, dragStartPos.current.x, dragStartPos.current.y);
        if (distance < 5) {
          e.stopPropagation();
          e.preventDefault();
          onTodoClick(todo);
        }
      } else {
        e.stopPropagation();
        e.preventDefault();
        onTodoClick(todo);
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      className="mb-2 p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity">
      <div className="flex items-start justify-between gap-1">
        <span className={todo.completed ? "line-through flex-1" : "flex-1"} style={{ color: getTextColor(isDarkMode, todo.completed), wordBreak: "break-word" }}>
          {todo.text}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(todo.id);
          }}
          className="text-xs px-1 hover:opacity-80"
          style={{ color: isDarkMode ? "#34d399" : "#10b981" }}>
          ✓
        </button>
      </div>
      {total > 0 && <div className="text-xs mt-1" style={{ color: getTextColor(isDarkMode, true) }}>{completedCount}/{total} 완료</div>}
    </div>
  );
}
