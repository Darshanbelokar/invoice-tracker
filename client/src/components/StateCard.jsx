/**
 * <StatCard
 *   label="Total invoiced"
 *   value="₹4,82,500"
 *   change="+12% this month"
 *   changeType="up"
 *   icon={<svg…/>}
 *   accent="indigo"   // "indigo" | "emerald" | "amber" | "red"
 * />
 */
const ACCENTS = {
  indigo:  { bg: 'bg-indigo-50',  icon: 'bg-indigo-100 text-indigo-600',  border: 'border-indigo-100'  },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-100' },
  amber:   { bg: 'bg-amber-50',   icon: 'bg-amber-100 text-amber-600',   border: 'border-amber-100'   },
  red:     { bg: 'bg-red-50',     icon: 'bg-red-100 text-red-600',       border: 'border-red-100'     },
}

export default function StatCard({ label, value, change, changeType = 'neutral', icon, accent = 'indigo' }) {
  const a = ACCENTS[accent] ?? ACCENTS.indigo

  const changeEl = {
    up:      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">↑ {change}</span>,
    down:    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">↓ {change}</span>,
    neutral: <span className="text-[12px] text-gray-400">— {change}</span>,
  }[changeType]

  return (
    <div className={`relative bg-white rounded-2xl p-5 border ${a.border} shadow-sm overflow-hidden`}>
      {/* Subtle background tint */}
      <div className={`absolute inset-0 ${a.bg} opacity-30 pointer-events-none`} />

      <div className="relative flex items-start justify-between mb-4">
        <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        {icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.icon}`}>
            {icon}
          </div>
        )}
      </div>

      <p className="relative text-[28px] font-bold text-gray-900 tracking-tight leading-none mb-3">
        {value}
      </p>

      {change && <div className="relative">{changeEl}</div>}
    </div>
  )
}