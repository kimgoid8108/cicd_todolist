"use client";

import { useState, useEffect } from "react";

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ isDarkMode, setIsDarkMode, activeTab, setActiveTab }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="flex items-center justify-center gap-10 w-full max-w-md mb-4">
        <h1
          className="text-2xl font-bold transition-colors"
          style={{
            color: isDarkMode ? "#ffffff" : "#111827",
          }}>
          투두리스트
        </h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-4 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
            color: isDarkMode ? "#ffffff" : "#111827",
            cursor: "pointer",
          }}>
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Digital Clock */}
      <div
        className="mb-4 px-6 py-3 rounded-lg font-mono text-3xl font-bold tracking-wider transition-colors"
        style={{
          backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
          color: isDarkMode ? "#60a5fa" : "#3b82f6",
          boxShadow: isDarkMode ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: `2px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
        }}>
        ⏱ {currentTime}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("todo")}
          className="px-4 py-2 rounded"
          style={{
            backgroundColor: activeTab === "todo" ? "#3b82f6" : isDarkMode ? "#374151" : "#e5e7eb",
            color: activeTab === "todo" ? "#ffffff" : isDarkMode ? "#ffffff" : "#111827",
            cursor: "pointer",
          }}>
          Todo
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className="px-4 py-2 rounded"
          style={{
            backgroundColor: activeTab === "calendar" ? "#3b82f6" : isDarkMode ? "#374151" : "#e5e7eb",
            color: activeTab === "calendar" ? "#ffffff" : isDarkMode ? "#ffffff" : "#111827",
            cursor: "pointer",
          }}>
          주간 캘린더
        </button>
      </div>
    </div>
  );
}
