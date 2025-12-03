export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export const getWeekRange = (weekDays: Array<{ month: number; dayNumber: number; date: Date }>) => {
  if (weekDays.length === 0) return "";

  const firstDay = weekDays[0];
  const lastDay = weekDays[weekDays.length - 1];

  const firstYear = firstDay.date.getFullYear();
  const lastYear = lastDay.date.getFullYear();
  const firstMonth = firstDay.month;
  const lastMonth = lastDay.month;
  const firstDayNum = firstDay.dayNumber;
  const lastDayNum = lastDay.dayNumber;

  // 년도가 다르면 양쪽 모두 년월일 표시
  if (firstYear !== lastYear) {
    return `${firstYear}년 ${firstMonth}월 ${firstDayNum}일 - ${lastYear}년 ${lastMonth}월 ${lastDayNum}일`;
  }

  // 월이 다르면 양쪽 모두 월일 표시 (년도는 한번만)
  if (firstMonth !== lastMonth) {
    return `${firstYear}년 ${firstMonth}월 ${firstDayNum}일 - ${lastMonth}월 ${lastDayNum}일`;
  }

  // 같은 월이면 년월은 한번만, 일은 양쪽 표시
  return `${firstYear}년 ${firstMonth}월 ${firstDayNum}일 - ${lastDayNum}일`;
};

export const generateWeekDays = (
  startDate: Date,
  dayNames: string[]
): Array<{
  date: Date;
  dayOfWeek: string;
  dayNumber: number;
  month: number;
  isToday: boolean;
  dateString: string;
}> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sunday = new Date(startDate);
  const day = sunday.getDay();
  sunday.setDate(sunday.getDate() - day);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    days.push({
      date,
      dayOfWeek: dayNames[date.getDay()],
      dayNumber: date.getDate(),
      month: date.getMonth() + 1,
      isToday: compareDate.getTime() === today.getTime(),
      dateString: date.toISOString().split("T")[0],
    });
  }
  return days;
};
