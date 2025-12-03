# 🔗 프론트엔드-백엔드 연동 가이드

## ✅ 완료된 작업

### 1. API 서비스 생성
- `services/api.ts` - REST API 호출 함수들
- 타입 안전성이 보장된 API 클라이언트

### 2. 새로운 Hook 생성
- `hooks/useTodosApi.ts` - 백엔드 API와 연동된 Hook
- 자동 데이터 로딩, 에러 처리 포함

### 3. 환경 변수 설정
- `.env.local` - API URL 설정

### 4. 타입 업데이트
- `types/index.ts` - 백엔드 응답 형식에 맞춤

---

## 🚀 사용 방법

### 1. 백엔드 서버 실행

```bash
cd backend
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

### 2. 프론트엔드 서버 실행

```bash
cd frontend
npm run dev
```

프론트엔드가 `http://localhost:3001`에서 실행됩니다.

### 3. 앱 테스트

브라우저에서 `http://localhost:3001`로 접속하여:
- Todo 추가/수정/삭제
- Subtask 추가/수정/삭제
- 드래그 앤 드롭
- 완료 토글

---

## 📦 주요 파일

### services/api.ts

```typescript
// Todo API 호출
export const todoApi = {
  getAll: (date?) => Promise<TodoResponse[]>,
  getById: (id) => Promise<TodoResponse>,
  create: (data) => Promise<TodoResponse>,
  update: (id, data) => Promise<TodoResponse>,
  delete: (id) => Promise<void>,
  toggleComplete: (id) => Promise<TodoResponse>,
  reorder: (todos) => Promise<void>,
  updateDate: (id, date) => Promise<TodoResponse>,
};

// Subtask API 호출
export const subtaskApi = {
  getByTodoId: (todoId) => Promise<SubtaskResponse[]>,
  create: (todoId, data) => Promise<SubtaskResponse>,
  update: (id, data) => Promise<SubtaskResponse>,
  delete: (id) => Promise<void>,
  toggleComplete: (id) => Promise<SubtaskResponse>,
};
```

### hooks/useTodosApi.ts

```typescript
export const useTodosApi = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [subtasks, setSubtasks] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 자동으로 데이터 로드
  useEffect(() => {
    loadTodos();
  }, []);

  return {
    todos,
    subtasks,
    loading,
    error,
    addTodo,
    removeTodo,
    toggleComplete,
    // ... 모든 CRUD 함수
  };
};
```

---

## 🔄 데이터 흐름

### Todo 생성 예시

```
1. 사용자가 Todo 입력
   ↓
2. addTodo("새 할일", "2024-12-03")
   ↓
3. todoApi.create({ text: "새 할일", date: "2024-12-03" })
   ↓
4. POST http://localhost:3000/todos
   ↓
5. 백엔드 응답: { id: 1, text: "새 할일", ... }
   ↓
6. 프론트엔드 상태 업데이트
   ↓
7. UI 자동 갱신
```

---

## ⚠️ 주의사항

### 1. 백엔드 서버가 실행 중이어야 합니다

백엔드가 실행되지 않으면:
```
❌ 서버와 통신할 수 없습니다
```

### 2. 포트 충돌 확인

- 백엔드: `3000`
- 프론트엔드: `3001` (또는 자동 할당)

### 3. CORS 설정

백엔드에서 CORS가 활성화되어 있어야 합니다:

```javascript
// backend/src/app.js
app.use(cors());
```

---

## 🐛 문제 해결

### "서버와 통신할 수 없습니다"

**원인**: 백엔드가 실행되지 않음

**해결**:
```bash
cd backend
npm run dev
```

### "데이터를 불러오는데 실패했습니다"

**원인**: 데이터베이스 연결 문제

**해결**:
```bash
cd backend
# .env 파일 확인
# DATABASE_URL 설정 확인
npm run prisma:push
```

### API 응답이 없음

**확인 사항**:
1. 백엔드 콘솔에서 에러 확인
2. 브라우저 개발자 도구 → Network 탭 확인
3. 백엔드 URL 확인: `http://localhost:3000/health`

---

## 🎯 기능별 API 호출

### Todo 관련

| 기능 | 함수 | API |
|------|------|-----|
| 목록 조회 | `loadTodos()` | GET /todos |
| 추가 | `addTodo(text, date)` | POST /todos |
| 삭제 | `removeTodo(id)` | DELETE /todos/:id |
| 완료 | `toggleComplete(id)` | PATCH /todos/:id/complete |
| 날짜 변경 | `updateTodoDate(id, date)` | PATCH /todos/:id/date |
| 순서 변경 | `updateTodosOrder(order)` | PATCH /todos/reorder |

### Subtask 관련

| 기능 | 함수 | API |
|------|------|-----|
| 추가 | `addSubtask(todoId, text)` | POST /todos/:id/subtasks |
| 삭제 | `removeSubtask(todoId, subtaskId)` | DELETE /subtasks/:id |
| 완료 | `toggleSubtaskComplete(todoId, subtaskId)` | PATCH /subtasks/:id/complete |

---

## 📱 실시간 동기화

모든 작업은 즉시 백엔드와 동기화됩니다:

✅ **낙관적 업데이트**: UI가 먼저 업데이트되고 API 호출
✅ **에러 처리**: 실패 시 자동으로 이전 상태로 복구
✅ **로딩 상태**: 사용자에게 진행 상황 표시

---

## 🎉 완료!

이제 프론트엔드와 백엔드가 완전히 연동되었습니다!

**테스트 순서:**
1. 백엔드 실행 (`cd backend && npm run dev`)
2. 프론트엔드 실행 (`cd frontend && npm run dev`)
3. 브라우저에서 앱 열기
4. Todo 추가/수정/삭제 테스트
5. 브라우저 새로고침 → 데이터 유지 확인! ✨
