import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import type { SortConfig, SortField, FilterStatus } from "@/types/todo";

interface FilterBarProps {
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
  counts: { all: number; active: number; completed: number };
}

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: "createdAt", label: "创建时间" },
  { field: "updatedAt", label: "更新时间" },
  { field: "dueDate", label: "截止日期" },
  { field: "priority", label: "优先级" },
  { field: "title", label: "任务名称" },
];

export default function FilterBar({
  filterStatus,
  onFilterChange,
  sortConfig,
  onSortChange,
  counts,
}: FilterBarProps) {
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSort) return;
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSort]);

  const filters: { key: FilterStatus; label: string; count: number }[] = [
    { key: "all", label: "全部", count: counts.all },
    { key: "active", label: "未完成", count: counts.active },
    { key: "completed", label: "已完成", count: counts.completed },
  ];

  const currentSortLabel = SORT_OPTIONS.find((o) => o.field === sortConfig.field)?.label ?? "排序";

  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filterStatus === f.key
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {f.label}
            <span className={`text-xs ${filterStatus === f.key ? "text-primary-100" : "text-gray-400 dark:text-gray-500"}`}>
              ({f.count})
            </span>
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="relative flex-shrink-0" ref={sortRef}>
        <button
          onClick={() => setShowSort(!showSort)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{currentSortLabel}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {showSort && (
          <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1 animate-slide-down">
            {SORT_OPTIONS.map((option) => (
              <div key={option.field}>
                <button
                  onClick={() => {
                    if (sortConfig.field === option.field) {
                      onSortChange({
                        field: option.field,
                        direction: sortConfig.direction === "asc" ? "desc" : "asc",
                      });
                    } else {
                      onSortChange({ field: option.field, direction: "desc" });
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                  {sortConfig.field === option.field && (
                    <span className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                      <Check className="w-3.5 h-3.5 text-primary-500" />
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
