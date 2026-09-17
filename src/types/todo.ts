export type Priority = "none" | "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  reminderAt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  order: number;
}

export type ViewType = "inbox" | "today" | "upcoming" | "completed" | "all" | "tag";

export type SortField = "createdAt" | "updatedAt" | "dueDate" | "priority" | "title";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export type FilterStatus = "all" | "active" | "completed";

export interface AppSettings {
  theme: "light" | "dark" | "system";
}

export const DEFAULT_TAGS = ["工作", "个人", "学习", "购物", "其他"];

export const PRIORITY_LABELS: Record<Priority, string> = {
  none: "无优先级",
  low: "低",
  medium: "中",
  high: "高",
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};
