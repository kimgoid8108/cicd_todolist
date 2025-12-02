import TodoItem from "./TodoItem";
import TodoInput from "./TodoInput";

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Todo {
  id: string;
  text: string;
  date: string;
  completed: boolean;
}

interface TodoListProps {
  isDarkMode: boolean;
  todos: Todo[];
  subtasks: { [todoId: string]: Subtask[] };
  addTodo: (text: string, date: string) => void;
  removeTodo: (todoId: string) => void;
  toggleComplete: (todoId: string) => void;
  addSubtask: (todoId: string, subtask: string) => void;
  removeSubtask: (todoId: string, subtaskId: string) => void;
  toggleSubtaskComplete: (todoId: string, subtaskId: string) => void;
}

export default function TodoList({ isDarkMode, todos, subtasks, addTodo, removeTodo, toggleComplete, addSubtask, removeSubtask, toggleSubtaskComplete }: TodoListProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-2xl">
        <TodoInput isDarkMode={isDarkMode} addTodo={addTodo} />
      </div>
      <ul className="w-full max-w-2xl mt-4">
        {todos.map((todo) => {
          const todoSubtasks = subtasks[todo.id] || [];

          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              isDarkMode={isDarkMode}
              subtasks={todoSubtasks}
              onToggleComplete={() => toggleComplete(todo.id)}
              onRemove={() => removeTodo(todo.id)}
              onAddSubtask={(subtask) => addSubtask(todo.id, subtask)}
              onRemoveSubtask={(subtaskId) => removeSubtask(todo.id, subtaskId)}
              onToggleSubtaskComplete={(subtaskId) => toggleSubtaskComplete(todo.id, subtaskId)}
            />
          );
        })}
      </ul>
    </div>
  );
}
