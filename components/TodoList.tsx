import TodoItem from "./TodoItem";
import TodoInput from "./TodoInput";
import { Todo, Subtask } from "@/types";

interface TodoListProps {
  isDarkMode: boolean;
  todos: Todo[];
  subtasks: { [todoId: string | number]: Subtask[] };
  addTodo: (text: string, date: string) => void;
  removeTodo: (todoId: string | number) => void;
  toggleComplete: (todoId: string | number) => void;
  addSubtask: (todoId: string | number, subtask: string) => void;
  removeSubtask: (todoId: string | number, subtaskId: string | number) => void;
  toggleSubtaskComplete: (todoId: string | number, subtaskId: string | number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function TodoList({ isDarkMode, todos, subtasks, addTodo, removeTodo, toggleComplete, addSubtask, removeSubtask, toggleSubtaskComplete, searchQuery, setSearchQuery }: TodoListProps) {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="w-full max-w-2xl flex-shrink-0">
        <TodoInput isDarkMode={isDarkMode} addTodo={addTodo} />

        {/* 검색창 */}
        <div className="mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Todo 검색..."
            className="w-full p-3 rounded-lg border-2 transition-colors"
            style={{
              backgroundColor: isDarkMode ? "#374151" : "#ffffff",
              borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
              color: isDarkMode ? "#ffffff" : "#111827",
            }}
          />
        </div>
      </div>
      <div className={`w-full max-w-2xl mt-4 flex-1 overflow-y-auto ${isDarkMode ? 'dark-scrollbar' : 'custom-scrollbar'}`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: isDarkMode ? "#4b5563 transparent" : "#d1d5db transparent"
        }}
      >
        {todos.length === 0 && searchQuery ? (
          <div className="text-center py-8" style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}>
            <p className="text-lg">🔍 검색 결과가 없습니다</p>
            <p className="text-sm mt-2">"{searchQuery}"에 대한 Todo를 찾을 수 없습니다</p>
          </div>
        ) : (
          <ul className="w-full">
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
        )}
      </div>
    </div>
  );
}
