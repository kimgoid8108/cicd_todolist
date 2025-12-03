export const getTextColor = (isDarkMode: boolean, completed?: boolean) => {
  if (completed) {
    return isDarkMode ? "#9ca3af" : "#6b7280";
  }
  return isDarkMode ? "#ffffff" : "#111827";
};

export const getBgColor = (isDarkMode: boolean) => {
  return isDarkMode ? "#1f2937" : "#ffffff";
};

export const getBorderColor = (isDarkMode: boolean) => {
  return isDarkMode ? "#374151" : "#e5e7eb";
};

export const getSecondaryBgColor = (isDarkMode: boolean) => {
  return isDarkMode ? "#374151" : "#f3f4f6";
};

export const getDayOfWeekColor = (dayOfWeek: string, isToday: boolean, isDarkMode: boolean) => {
  if (isToday) return "#ffffff";
  if (dayOfWeek === "일") return "#ef4444";
  if (dayOfWeek === "토") return "#3b82f6";
  return isDarkMode ? "#ffffff" : "#111827";
};
