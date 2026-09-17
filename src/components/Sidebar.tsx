import {
  Inbox as InboxIcon,
  Sun,
  Calendar as CalendarIcon,
  CheckCircle2,
  X,
  Hash,
} from "lucide-react";
import type { ViewType, Todo } from "@/types/todo";
import { getTagCounts } from "@/utils/todo";
import { isToday, isFuture } from "@/utils/date";

interface SidebarProps {
  todos: Todo[];
  view: ViewType;
  setView: (view: ViewType) => void;
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
  onOpenMobile?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  todos,
  view,
  setView,
  activeTag,
  setActiveTag,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const inboxCount = todos.filter((t) => !t.completed).length;
  const todayCount = todos.filter((t) => isToday(t.dueDate) && !t.completed).length;
  const upcomingCount = todos.filter((t) => isFuture(t.dueDate) && !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  const tagCounts = getTagCounts(todos);

  const handleSelectView = (newView: ViewType) => {
    setView(newView);
    if (newView !== "tag") {
      setActiveTag(null);
    }
    onCloseMobile?.();
  };

  const handleSelectTag = (tag: string) => {
    setActiveTag(tag);
    setView("tag");
    onCloseMobile?.();
  };

  const sidebarContent = (
    <>
      {/* Smart categories */}
      <div className="px-3 py-2">
        <div className="space-y-0.5">
          <SidebarItem
            icon={<InboxIcon className="w-4 h-4" />}
            label="收件箱"
            count={inboxCount}
            active={view === "inbox"}
            onClick={() => handleSelectView("inbox")}
          />
          <SidebarItem
            icon={<Sun className="w-4 h-4" />}
            label="今天"
            count={todayCount}
            active={view === "today"}
            onClick={() => handleSelectView("today")}
          />
          <SidebarItem
            icon={<CalendarIcon className="w-4 h-4" />}
            label="计划"
            count={upcomingCount}
            active={view === "upcoming"}
            onClick={() => handleSelectView("upcoming")}
          />
          <SidebarItem
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="已完成"
            count={completedCount}
            active={view === "completed"}
            onClick={() => handleSelectView("completed")}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2 mt-2">
        <div className="px-3 py-1 text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
          <Hash className="w-3 h-3" /> 标签
        </div>
        <div className="space-y-0.5 mt-1">
          {tagCounts.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-400 dark:text-gray-600">暂无标签</p>
          ) : (
            tagCounts.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => handleSelectTag(tag)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  view === "tag" && activeTag === tag
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <span className="truncate">#{tag}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{count}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar (drawer) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 max-w-[80vw] bg-white dark:bg-gray-800 overflow-y-auto animate-slide-down">
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold">导航</h2>
              <button onClick={onCloseMobile} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-2">{sidebarContent}</div>
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarItem({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1 text-left truncate">{label}</span>
      {count > 0 && (
        <span className={`text-xs ${active ? "text-primary-500" : "text-gray-400 dark:text-gray-500"}`}>
          {count}
        </span>
      )}
    </button>
  );
}
