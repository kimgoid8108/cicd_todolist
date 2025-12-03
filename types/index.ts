export interface Todo {
  id: string;
  text: string;
  date: string;
  completed: boolean;
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayInfo {
  date: Date;
  dayOfWeek: string;
  dayNumber: number;
  month: number;
  isToday: boolean;
  dateString: string;
}
