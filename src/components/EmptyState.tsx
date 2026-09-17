import { CheckCircle2, Search, PartyPopper, Inbox } from "lucide-react";

interface EmptyStateProps {
  type: "no-todos" | "no-results" | "no-completed";
  onAdd?: () => void;
}

export default function EmptyState({ type, onAdd }: EmptyStateProps) {
  if (type === "no-todos") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">还没有待办任务</h3>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          创建一个任务，开始规划今天的事情吧。
        </p>
        {onAdd && (
          <button onClick={onAdd} className="btn btn-primary mt-6">
            + 添加任务
          </button>
        )}
      </div>
    );
  }

  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">没有找到相关任务</h3>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">尝试搜索其他关键词</p>
      </div>
    );
  }

  if (type === "no-completed") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
          <PartyPopper className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">还没有完成的任务</h3>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">完成任务后会显示在这里</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">空空如也</h3>
    </div>
  );
}
