import type { Todo, SortConfig, ViewType } from "@/types/todo";
import { PRIORITY_ORDER } from "@/types/todo";
import { isToday, isFuture } from "@/utils/date";

export function sortTodos(todos: Todo[], config: SortConfig): Todo[] {
  const sorted = [...todos];
  const { field, direction } = config;
  const dir = direction === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    switch (field) {
      case "createdAt":
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
      case "updatedAt":
        return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * dir;
      case "dueDate": {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * dir;
      }
      case "priority":
        return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir;
      case "title":
        return a.title.localeCompare(b.title, "zh-CN") * dir;
      default:
        return 0;
    }
  });

  return sorted;
}

export function filterTodos(
  todos: Todo[],
  view: ViewType,
  filterStatus: "all" | "active" | "completed",
  searchQuery: string,
  activeTag: string | null
): Todo[] {
  let result = [...todos];

  // Filter by smart category view
  switch (view) {
    case "inbox":
      result = result.filter((t) => !t.completed);
      break;
    case "today":
      result = result.filter((t) => isToday(t.dueDate) && !t.completed);
      break;
    case "upcoming":
      result = result.filter((t) => isFuture(t.dueDate) && !t.completed);
      break;
    case "completed":
      result = result.filter((t) => t.completed);
      break;
    case "tag":
      if (activeTag) {
        result = result.filter((t) => t.tags.includes(activeTag));
      }
      break;
    case "all":
    default:
      break;
  }

  // Filter by status (for all/inbox/tag views)
  if (view !== "completed") {
    switch (filterStatus) {
      case "active":
        result = result.filter((t) => !t.completed);
        break;
      case "completed":
        result = result.filter((t) => t.completed);
        break;
      case "all":
      default:
        break;
    }
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q) ?? false) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return result;
}

export function getStats(todos: Todo[]) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const todayTodos = todos.filter((t) => isToday(t.dueDate));
  const todayTotal = todayTodos.length;
  const todayCompleted = todayTodos.filter((t) => t.completed).length;
  const todayActive = todayTotal - todayCompleted;
  const todayRate = todayTotal === 0 ? 0 : Math.round((todayCompleted / todayTotal) * 100);

  return {
    total,
    completed,
    active,
    completionRate,
    todayTotal,
    todayCompleted,
    todayActive,
    todayRate,
  };
}

export function getTagCounts(todos: Todo[]): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const todo of todos) {
    for (const tag of todo.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function generateId(): string {
  return `todo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getViewTitle(view: ViewType, activeTag: string | null): string {
  switch (view) {
    case "inbox":
      return "收件箱";
    case "today":
      return "今天";
    case "upcoming":
      return "计划";
    case "completed":
      return "已完成";
    case "tag":
      return activeTag ?? "标签";
    case "all":
    default:
      return "全部";
  }
}
