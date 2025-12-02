"use client";

interface CalendarHeaderProps {
  isDarkMode: boolean;
  weekRange: string;
  onPreviousWeek: () => void;
  onToday: () => void;
  onNextWeek: () => void;
}

export default function CalendarHeader({ isDarkMode, weekRange, onPreviousWeek, onToday, onNextWeek }: CalendarHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">주간 캘린더</h2>
        <div className="flex gap-2">
          <button
            onClick={onPreviousWeek}
            className="px-3 py-1 rounded transition-colors"
            style={{
              backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
              color: isDarkMode ? "#ffffff" : "#111827",
            }}>
            지난주
          </button>
          <button
            onClick={onToday}
            className="px-3 py-1 rounded transition-colors"
            style={{
              backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
              color: isDarkMode ? "#ffffff" : "#111827",
            }}>
            오늘
          </button>
          <button
            onClick={onNextWeek}
            className="px-3 py-1 rounded transition-colors"
            style={{
              backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
              color: isDarkMode ? "#ffffff" : "#111827",
            }}>
            다음주
          </button>
        </div>
      </div>

      <div className="mb-4 text-center">
        <p
          className="text-lg font-semibold"
          style={{
            color: isDarkMode ? "#d1d5db" : "#4b5563",
          }}>
          {weekRange}
        </p>
      </div>
    </>
  );
}
