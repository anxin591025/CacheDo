import { useState, useCallback, useEffect, useRef } from "react";
import type { Todo, SortConfig, FilterStatus, ViewType, AppSettings } from "@/types/todo";
import { loadTodos, saveTodos, loadSettings, saveSettings, clearAllData, exportTodos, importTodosFromJSON } from "@/utils/storage";
import { generateId } from "@/utils/todo";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [settings, setSettingsState] = useState<AppSettings>(() => loadSettings());
  const [view, setView] = useState<ViewType>("today");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: "createdAt", direction: "desc" });
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Persist todos whenever they change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // Persist settings whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (theme: "light" | "dark" | "system") => {
      if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      } else if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme(settings.theme);

    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [settings.theme]);

  const addTodo = useCallback((data: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt" | "order">>) => {
    const now = new Date().toISOString();
    const maxOrder = todos.reduce((max, t) => Math.max(max, t.order), 0);
    const newTodo: Todo = {
      id: generateId(),
      title: data.title ?? "",
      description: data.description,
      completed: false,
      priority: data.priority ?? "none",
      dueDate: data.dueDate,
      reminderAt: data.reminderAt,
      tags: data.tags ?? [],
      createdAt: now,
      updatedAt: now,
      order: maxOrder + 1,
    };
    setTodos((prev) => [...prev, newTodo]);
  }, [todos]);

  const updateTodo = useCallback((id: string, data: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...data, updatedAt: new Date().toISOString() }
          : t
      )
    );
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
          : t
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const duplicateTodo = useCallback((id: string) => {
    const source = todos.find((t) => t.id === id);
    if (!source) return;
    const now = new Date().toISOString();
    const maxOrder = todos.reduce((max, t) => Math.max(max, t.order), 0);
    const newTodo: Todo = {
      ...source,
      id: generateId(),
      title: `${source.title} (副本)`,
      completed: false,
      createdAt: now,
      updatedAt: now,
      order: maxOrder + 1,
    };
    setTodos((prev) => [...prev, newTodo]);
  }, [todos]);

  const reorderTodos = useCallback((reordered: Todo[]) => {
    const updated = reordered.map((t, idx) => ({ ...t, order: idx + 1 }));
    const ids = new Set(updated.map((t) => t.id));
    setTodos((prev) => {
      const others = prev.filter((t) => !ids.has(t.id));
      return [...others, ...updated];
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const handleExport = useCallback(() => {
    const jsonStr = exportTodos();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback((jsonString: string): { success: boolean; count: number; message: string } => {
    const result = importTodosFromJSON(jsonString);
    if (result.success) {
      setTodos(loadTodos());
    }
    return result;
  }, []);

  const handleClearAll = useCallback(() => {
    clearAllData();
    setTodos([]);
    setSettingsState({ theme: "system" });
  }, []);

  const setSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const openEditor = useCallback((todo: Todo | null = null) => {
    setEditingTodo(todo);
    setIsEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    setIsEditorOpen(false);
    setEditingTodo(null);
  }, []);

  return {
    todos,
    settings,
    view,
    setView,
    activeTag,
    setActiveTag,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    sortConfig,
    setSortConfig,
    isEditorOpen,
    editingTodo,
    deleteTarget,
    setDeleteTarget,
    showSettings,
    setShowSettings,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    duplicateTodo,
    reorderTodos,
    clearCompleted,
    handleExport,
    handleImport,
    handleClearAll,
    setSettings,
    openEditor,
    closeEditor,
  };
}

export type UseTodosReturn = ReturnType<typeof useTodos>;
