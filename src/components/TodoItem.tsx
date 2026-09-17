import { useState, useRef, useEffect } from "react";
import {
  Check,
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  AlertCircle,
} from "lucide-react";
import type { Todo, Priority } from "@/types/todo";
import { PRIORITY_LABELS } from "@/types/todo";
import { formatDate, isOverdue, isToday } from "@/utils/date";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onDuplicate: (id: string) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  none: "",
  low: "text-blue-500 dark:text-blue-400",
  medium: "text-amber-500 dark:text-amber-400",
  high: "text-red-500 dark:text-red-400",
};

const PRIORITY_DOTS: Record<Priority, string> = {
  none: "",
  low: "●",
  medium: "●●",
  high: "●●●",
};

export default function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}: TodoItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const overdue = !todo.completed && isOverdue(todo.dueDate);
  const isTodayTask = isToday(todo.dueDate);

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
        isDragging ? "opacity-30" : ""
      } ${
        todo.completed
          ? "border-transparent bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
          : "border-transparent bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-sm"
      }`}
      onClick={() => onEdit(todo)}
    >
      {/* Checkbox / Circle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(todo.id);
        }}
        className="flex-shrink-0 mt-0.5 transition-transform active:scale-90"
        aria-label={todo.completed ? "恢复任务" : "完成任务"}
      >
        {todo.completed ? (
          <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-primary-500" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${todo.completed ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-900 dark:text-gray-100"}`}>
          {todo.title}
        </div>
        {todo.description && (
          <div className={`mt-0.5 text-xs ${todo.completed ? "text-gray-400 dark:text-gray-600" : "text-gray-500 dark:text-gray-400"} line-clamp-2`}>
            {todo.description}
          </div>
        )}

        {/* Meta */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          {todo.dueDate && (
            <span className={`flex items-center gap-1 text-xs ${overdue ? "text-red-500 dark:text-red-400 font-medium" : "text-gray-400 dark:text-gray-500"}`}>
              <Calendar className="w-3 h-3" />
              {formatDate(todo.dueDate)}
              {overdue && <AlertCircle className="w-3 h-3" />}
            </span>
          )}

          {todo.priority !== "none" && (
            <span className={`flex items-center gap-1 text-xs font-medium ${PRIORITY_COLORS[todo.priority]}`}>
              {PRIORITY_DOTS[todo.priority]}
              <span className="hidden sm:inline">{PRIORITY_LABELS[todo.priority]}优先级</span>
              <span className="sm:hidden">{PRIORITY_LABELS[todo.priority]}</span>
            </span>
          )}

          {todo.tags.map((tag) => (
            <span key={tag} className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(todo);
          }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="编辑"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="更多"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 z-20 w-36 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1 animate-slide-down">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onEdit(todo);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Pencil className="w-4 h-4" /> 编辑
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDuplicate(todo.id);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Copy className="w-4 h-4" /> 复制
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onToggle(todo.id);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {todo.completed ? (
                  <>
                    <Circle className="w-4 h-4" /> 标记未完成
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> 标记完成
                  </>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDelete(todo);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" /> 删除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile actions always visible */}
      <div className="flex-shrink-0 sm:hidden">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
