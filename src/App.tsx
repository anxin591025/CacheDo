import { useRef, useEffect, useState, useCallback } from "react";
import { useTodos } from "@/hooks/useTodos";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TodoList from "@/components/TodoList";
import TodoEditor from "@/components/TodoEditor";
import FilterBar from "@/components/FilterBar";
import SettingsPanel from "@/components/SettingsPanel";
import BottomNav from "@/components/BottomNav";
import StatsBar from "@/components/StatsBar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { getStats, getViewTitle } from "@/utils/todo";
import { getTodayLongDate } from "@/utils/date";
import type { Todo } from "@/types/todo";

export default function App() {
  const {
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
    handleExport,
    handleImport,
    handleClearAll,
    setSettings,
    openEditor,
    closeEditor,
  } = useTodos();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [deleteInput, setDeleteInput] = useState("");

  const stats = getStats(todos);

  // Filtered counts for current view
  const viewFiltered = todos.filter((t) => {
    switch (view) {
      case "inbox":
        return !t.completed;
      case "today":
        return true; // will be further filtered by TodoList
      case "upcoming":
        return true;
      case "completed":
        return t.completed;
      case "tag":
        return activeTag ? t.tags.includes(activeTag) : true;
      default:
        return true;
    }
  });

  const counts = {
    all: viewFiltered.length,
    active: viewFiltered.filter((t) => !t.completed).length,
    completed: viewFiltered.filter((t) => t.completed).length,
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputFocused = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable;

      // N — new task (not in input)
      if (e.key === "n" && !isInputFocused && !isEditorOpen && !showSettings) {
        e.preventDefault();
        openEditor(null);
        return;
      }

      // / — focus search
      if (e.key === "/" && !isInputFocused) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      // Escape — close modals (handled in components too, but as a fallback)
      if (e.key === "Escape") {
        if (isEditorOpen) {
          closeEditor();
        }
        if (showSettings) {
          setShowSettings(false);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isEditorOpen, showSettings, openEditor, closeEditor, setShowSettings]);

  const handleSaveTodo = useCallback(
    (data: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt" | "order">>, id?: string) => {
      if (id) {
        updateTodo(id, data);
      } else {
        addTodo(data);
      }
      closeEditor();
    },
    [addTodo, updateTodo, closeEditor]
  );

  const handleDelete = useCallback(() => {
    if (deleteTarget) {
      deleteTodo(deleteTarget.id);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteTodo, setDeleteTarget]);

  const handleMobileSearch = useCallback(() => {
    searchRef.current?.focus();
    searchRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        todos={todos}
        view={view}
        setView={setView}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenSettings={() => setShowSettings(true)}
          searchRef={searchRef}
        />

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-4 pb-20 lg:pb-4">
            {/* Page title */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {getViewTitle(view, activeTag)}
              </h2>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {getTodayLongDate()}
              </p>
            </div>

            {/* Stats bar — show on today view */}
            {(view === "today" || view === "all" || view === "inbox") && (
              <StatsBar
                todayTotal={stats.todayTotal}
                todayCompleted={stats.todayCompleted}
                todayActive={stats.todayActive}
                todayRate={stats.todayRate}
              />
            )}

            {/* Filter bar */}
            {view !== "completed" && view !== "today" && view !== "upcoming" && (
              <FilterBar
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
                counts={counts}
              />
            )}

            {/* For today/upcoming/completed views, still show sort but not status filter */}
            {(view === "today" || view === "upcoming" || view === "completed") && (
              <FilterBar
                filterStatus={view === "completed" ? "completed" : "active"}
                onFilterChange={setFilterStatus}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
                counts={counts}
              />
            )}

            {/* Todo list */}
            <TodoList
              todos={todos}
              view={view}
              activeTag={activeTag}
              filterStatus={filterStatus}
              searchQuery={searchQuery}
              sortConfig={sortConfig}
              onToggle={toggleTodo}
              onEdit={(todo) => openEditor(todo)}
              onDelete={(todo) => setDeleteTarget(todo)}
              onDuplicate={duplicateTodo}
              onReorder={reorderTodos}
              onAdd={() => openEditor(null)}
            />
          </div>
        </div>
      </main>

      {/* Bottom nav (mobile) */}
      <BottomNav
        view={view}
        onSetView={setView}
        onAdd={() => openEditor(null)}
        onOpenSearch={handleMobileSearch}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Todo editor */}
      <TodoEditor
        open={isEditorOpen}
        editingTodo={editingTodo}
        onSave={handleSaveTodo}
        onClose={closeEditor}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="删除任务"
        message={`确定要删除「${deleteTarget?.title ?? ""}」吗？`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Settings panel */}
      <SettingsPanel
        open={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={setSettings}
        onExport={handleExport}
        onImport={handleImport}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
