// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// API 에러 타입
export class ApiError extends Error {
  constructor(public status: number, public message: string, public details?: any) {
    super(message);
    this.name = "ApiError";
  }
}

// API 헬퍼 함수
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    // 204 No Content는 body 없음
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || data.error || "요청 실패", data.details);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "서버와 통신할 수 없습니다");
  }
}

// ============================================
// Todo API
// ============================================

export interface TodoResponse {
  id: number;
  text: string;
  date: string;
  completed: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  subtasks?: SubtaskResponse[];
}

export interface SubtaskResponse {
  id: number;
  todo_id: number;
  text: string;
  completed: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  text: string;
  date: string;
  completed?: boolean;
  display_order?: number;
}

export interface UpdateTodoRequest {
  text?: string;
  date?: string;
  completed?: boolean;
  display_order?: number;
}

export const todoApi = {
  // 모든 Todo 조회
  getAll: async (date?: string): Promise<TodoResponse[]> => {
    const query = date ? `?date=${date}` : "";
    return fetchApi<TodoResponse[]>(`/todos${query}`);
  },

  // 특정 Todo 조회
  getById: async (id: number): Promise<TodoResponse> => {
    return fetchApi<TodoResponse>(`/todos/${id}`);
  },

  // Todo 생성
  create: async (data: CreateTodoRequest): Promise<TodoResponse> => {
    return fetchApi<TodoResponse>("/todos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Todo 수정
  update: async (id: number, data: UpdateTodoRequest): Promise<TodoResponse> => {
    return fetchApi<TodoResponse>(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Todo 삭제
  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(`/todos/${id}`, {
      method: "DELETE",
    });
  },

  // Todo 완료 토글
  toggleComplete: async (id: number): Promise<TodoResponse> => {
    return fetchApi<TodoResponse>(`/todos/${id}/complete`, {
      method: "PATCH",
    });
  },

  // Todo 순서 변경
  reorder: async (todos: { id: number; display_order: number }[]): Promise<void> => {
    return fetchApi<void>("/todos/reorder", {
      method: "PATCH",
      body: JSON.stringify({ todos }),
    });
  },

  // Todo 날짜 변경
  updateDate: async (id: number, date: string, display_order?: number): Promise<TodoResponse> => {
    return fetchApi<TodoResponse>(`/todos/${id}/date`, {
      method: "PATCH",
      body: JSON.stringify({ date, display_order: display_order || 0 }),
    });
  },
};

// ============================================
// Subtask API
// ============================================

export interface CreateSubtaskRequest {
  text: string;
  completed?: boolean;
  display_order?: number;
}

export interface UpdateSubtaskRequest {
  text?: string;
  completed?: boolean;
  display_order?: number;
}

export const subtaskApi = {
  // Todo의 모든 Subtask 조회
  getByTodoId: async (todoId: number): Promise<SubtaskResponse[]> => {
    return fetchApi<SubtaskResponse[]>(`/todos/${todoId}/subtasks`);
  },

  // Subtask 생성
  create: async (todoId: number, data: CreateSubtaskRequest): Promise<SubtaskResponse> => {
    return fetchApi<SubtaskResponse>(`/todos/${todoId}/subtasks`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Subtask 수정
  update: async (id: number, data: UpdateSubtaskRequest): Promise<SubtaskResponse> => {
    return fetchApi<SubtaskResponse>(`/subtasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Subtask 삭제
  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(`/subtasks/${id}`, {
      method: "DELETE",
    });
  },

  // Subtask 완료 토글
  toggleComplete: async (id: number): Promise<SubtaskResponse> => {
    return fetchApi<SubtaskResponse>(`/subtasks/${id}/complete`, {
      method: "PATCH",
    });
  },
};
