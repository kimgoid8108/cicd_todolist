"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface SortableTodoProps {
  id: string;
  children: React.ReactNode;
  dragHandleProps?: any;
}

export default function SortableTodo({ id, children, dragHandleProps }: SortableTodoProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: {
      type: "todo",
      todoId: id,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // dragHandleProps가 제공되면 그것을 사용, 아니면 기본 listeners 사용
  const handleProps = dragHandleProps || listeners;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children}
    </div>
  );
}
