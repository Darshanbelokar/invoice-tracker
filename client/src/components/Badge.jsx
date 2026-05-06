import { statusClass } from '../utils/format'

export default function Badge({ status }) {
  const dotColors = {
    Paid:       'bg-emerald-500',
    Cleared:    'bg-emerald-500',
    Pending:    'bg-amber-500',
    Processing: 'bg-blue-500',
    Overdue:    'bg-red-500',
    Failed:     'bg-red-500',
    Draft:      'bg-slate-400',
  }

  const bgColors = {
    Paid:       'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Cleared:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Pending:    'bg-amber-50 text-amber-700 border border-amber-200',
    Processing: 'bg-blue-50 text-blue-700 border border-blue-200',
    Overdue:    'bg-red-50 text-red-700 border border-red-200',
    Failed:     'bg-red-50 text-red-700 border border-red-200',
    Draft:      'bg-slate-100 text-slate-500 border border-slate-200',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${bgColors[status] ?? 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] ?? 'bg-gray-400'}`} />
      {status}
    </span>
  )
}