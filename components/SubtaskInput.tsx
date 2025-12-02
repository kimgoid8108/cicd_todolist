"use client";

import { useState } from "react";

interface SubtaskInputProps {
  isDarkMode: boolean;
  onAddSubtask: (subtask: string) => void;
}

export default function SubtaskInput({ isDarkMode, onAddSubtask }: SubtaskInputProps) {
  const [subtaskInput, setSubtaskInput] = useState("");

  const handleAddSubtask = () => {
    if (subtaskInput.trim() !== "") {
      onAddSubtask(subtaskInput);
      setSubtaskInput("");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="서브태스크 추가"
        value={subtaskInput}
        onChange={(e) => setSubtaskInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddSubtask();
          }
        }}
        className="border p-2 rounded w-full transition-colors"
        style={{
          backgroundColor: isDarkMode ? "#374151" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#111827",
          borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
        }}
      />
      <button onClick={handleAddSubtask} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
        추가
      </button>
    </div>
  );
}
