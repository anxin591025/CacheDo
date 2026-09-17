import { useRef, useState } from "react";
import type { Todo, SortConfig } from "@/types/todo";
import TodoItem from "./TodoItem";
import EmptyState from "./EmptyState";
import { filterTodos, sortTodos, getViewTitle } from "@/utils/todo";
import { isToday, isFuture } from "@/utils/date";
import type { ViewType, FilterStatus } from "@/types/todo";

interface TodoListProps {
  todos: Todo[];
  view: ViewType;
  activeTag: string | null;
  filterStatus: FilterStatus;
  searchQuery: string;
  sortConfig: SortConfig;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onDuplicate: (id: string) => void;
  onReorder: (reordered: Todo[]) => void;
  onAdd: () => void;
}

export default function TodoList({
  todos,
  view,
  activeTag,
  filterStatus,
  searchQuery,
  sortConfig,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onReorder,
  onAdd,
}: TodoListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const draggedIdRef = useRef<string | null>(null);

  const filtered = filterTodos(todos, view, filterStatus, searchQuery, activeTag);
  const sorted = sortTodos(filtered, sortConfig);
  const total = todos.length;

  // Determine empty state type
  let emptyType: "no-todos" | "no-results" | "no-completed" = "no-todos";
  if (total === 0) {
    emptyType = "no-todos";
  } else if (searchQuery.trim() && sorted.length === 0) {
    emptyType = "no-results";
  } else if (view === "completed" && sorted.length === 0) {
    emptyType = "no-completed";
  } else if (sorted.length === 0) {
    emptyType = "no-results";
  }

  // Drag and drop reordering — only when sorting by created time and not searching
  const canDragReorder = sorted.length > 1 && !searchQuery.trim() && sortConfig.field === "createdAt";

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (!canDragReorder) return;
    draggedIdRef.current = id;
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!canDragReorder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    if (!canDragReorder) return;
    e.preventDefault();
    const sourceId = draggedIdRef.current;
    if (!sourceId || sourceId === targetId) return;

    const reordered = [...sorted];
    const sourceIdx = reordered.findIndex((t) => t.id === sourceId);
    const targetIdx = reordered.findIndex((t) => t.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const [moved] = reordered.splice(sourceIdx, 1);
    reordered.splice(targetIdx, 0, moved);

    onReorder(reordered);
  };

  const handleDragEnd = () => {
    draggedIdRef.current = null;
    setDraggedId(null);
  };

  return (
    <div className="flex flex-col">
      {/* Add task button */}
      <button
        onClick={onAdd}
        className="flex items-center gap-2 p-3 mb-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-primary-300 hover:text-primary-500 dark:hover:border-primary-700 transition-all"
      >
        <span className="text-lg leading-none">+</span>
        <span className="text-sm">添加任务</span>
      </button>

      {/* Empty state */}
      {sorted.length === 0 ? (
        <EmptyState type={emptyType} onAdd={onAdd} />
      ) : (
        <div className="flex flex-col gap-1">
          {sorted.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onDragStart={canDragReorder ? (e) => handleDragStart(e, todo.id) : undefined}
              onDragOver={canDragReorder ? handleDragOver : undefined}
              onDrop={(e) => handleDrop(e, todo.id)}
              onDragEnd={canDragReorder ? handleDragEnd : undefined}
              isDragging={draggedId === todo.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
