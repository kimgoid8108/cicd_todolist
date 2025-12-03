export interface Todo {
  id: string | number;
  text: string;
  date: string;
  completed: boolean;
  display_order?: number;
}

export interface Subtask {
  id: string | number;
  text: string;
  completed: boolean;
  display_order?: number;
}

export interface DayInfo {
  date: Date;
  dayOfWeek: string;
  dayNumber: number;
  month: number;
  isToday: boolean;
  dateString: string;
}
