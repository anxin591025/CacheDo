import type { Todo, AppSettings } from "@/types/todo";

const STORAGE_KEYS = {
  todos: "todo-app.todos",
  settings: "todo-app.settings",
  version: "todo-app.version",
} as const;

const CURRENT_VERSION = 1;

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.todos);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTodo);
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos));
    localStorage.setItem(STORAGE_KEYS.version, String(CURRENT_VERSION));
  } catch {
    // storage full or unavailable — silently fail
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return { theme: "system" };
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.theme === "light" || parsed.theme === "dark" || parsed.theme === "system")) {
      return { theme: parsed.theme };
    }
    return { theme: "system" };
  } catch {
    return { theme: "system" };
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  } catch {
    // silently fail
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.todos);
    localStorage.removeItem(STORAGE_KEYS.settings);
    localStorage.removeItem(STORAGE_KEYS.version);
  } catch {
    // silently fail
  }
}

export function getVersion(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.version);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function isValidTodo(item: unknown): item is Todo {
  if (typeof item !== "object" || item === null) return false;
  const t = item as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    typeof t.completed === "boolean" &&
    typeof t.createdAt === "string" &&
    typeof t.updatedAt === "string"
  );
}

export function exportTodos(): string {
  const todos = loadTodos();
  const data = {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    todos,
  };
  return JSON.stringify(data, null, 2);
}

export function importTodosFromJSON(jsonString: string): { success: boolean; count: number; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    let todosArray: unknown[];

    if (Array.isArray(parsed)) {
      todosArray = parsed;
    } else if (parsed && Array.isArray(parsed.todos)) {
      todosArray = parsed.todos;
    } else {
      return { success: false, count: 0, message: "文件格式不正确。" };
    }

    const validTodos = todosArray.filter(isValidTodo) as Todo[];
    if (validTodos.length === 0) {
      return { success: false, count: 0, message: "文件中没有有效的任务数据。" };
    }

    saveTodos(validTodos);
    return { success: true, count: validTodos.length, message: `成功导入 ${validTodos.length} 个任务。` };
  } catch {
    return { success: false, count: 0, message: "文件格式不正确。" };
  }
}
