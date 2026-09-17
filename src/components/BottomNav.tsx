import { Home, Sun, Plus, Search, Settings } from "lucide-react";
import type { ViewType } from "@/types/todo";

interface BottomNavProps {
  view: ViewType;
  onSetView: (view: ViewType) => void;
  onAdd: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
}

export default function BottomNav({
  view,
  onSetView,
  onAdd,
  onOpenSearch,
  onOpenSettings,
}: BottomNavProps) {
  const items = [
    { key: "inbox" as ViewType, icon: <Home className="w-5 h-5" />, label: "首页" },
    { key: "today" as ViewType, icon: <Sun className="w-5 h-5" />, label: "今天" },
    { key: null, icon: <Plus className="w-6 h-6" />, label: "", isFab: true },
    { key: null, icon: <Search className="w-5 h-5" />, label: "搜索", action: "search" },
    { key: null, icon: <Settings className="w-5 h-5" />, label: "设置", action: "settings" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around h-14 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {items.map((item, idx) => {
        if (item.isFab) {
          return (
            <button
              key={idx}
              onClick={onAdd}
              className="w-12 h-12 -mt-6 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              aria-label="添加任务"
            >
              <Plus className="w-6 h-6" />
            </button>
          );
        }

        const active = item.key !== null && view === item.key;
        return (
          <button
            key={idx}
            onClick={() => {
              if (item.key) {
                onSetView(item.key);
              } else if (item.action === "search") {
                onOpenSearch();
              } else if (item.action === "settings") {
                onOpenSettings();
              }
            }}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
              active
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
