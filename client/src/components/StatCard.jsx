export default function StatCard({ title, value, change, changeType, icon: Icon, color }) {
  // Color mapping helper for cleaner code
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      icon: 'text-indigo-600 dark:text-indigo-400',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      icon: 'text-amber-600 dark:text-amber-400',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-950/50',
      icon: 'text-red-600 dark:text-red-400',
    },
    default: {
      bg: 'bg-slate-50 dark:bg-slate-800',
      icon: 'text-slate-600 dark:text-slate-300',
    }
  };

  const theme = colorMap[color] || colorMap.default;

  return (
    <div className="card bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
      <div className="flex items-start justify-between">
        <div>
          {/* Title */}
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>

          {/* Value */}
          <p
            className="text-2xl font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {value}
          </p>

          {/* Indicator / Change */}
          {change && (
            <p
              className={`text-xs font-medium mt-2 flex items-center gap-0.5 ${
                changeType === "up"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : changeType === "down"
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <span>
                {changeType === "up" ? "↑" : changeType === "down" ? "↓" : ""}
              </span>{" "}
              {change}
            </p>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className={`p-2.5 rounded-xl ${theme.bg}`}>
            <Icon className={`w-5 h-5 ${theme.icon}`} />
          </div>
        )}
      </div>
    </div>
  );
}