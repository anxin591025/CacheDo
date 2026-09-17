interface StatsBarProps {
  todayTotal: number;
  todayCompleted: number;
  todayActive: number;
  todayRate: number;
}

export default function StatsBar({ todayTotal, todayCompleted, todayActive, todayRate }: StatsBarProps) {
  const filled = Math.round((todayRate / 100) * 10);

  return (
    <div className="mb-4 px-1">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{todayTotal}</span>
          <span className="text-sm text-gray-400 dark:text-gray-500">个任务</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>已完成 {todayCompleted}</span>
          <span>待完成 {todayActive}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-500"
            style={{ width: `${todayRate}%` }}
          />
        </div>
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 min-w-[3rem] text-right">
          {todayRate}%
        </span>
      </div>
    </div>
  );
}
