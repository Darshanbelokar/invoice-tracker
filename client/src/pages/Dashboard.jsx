import { Link } from 'react-router-dom'
import StateCard from '../components/StateCard'
import Badge from '../components/Badge'
import RevenueChart from '../components/RevenueChart'
import { INVOICES } from '../data/mockData'
import { fmt, fmtDate } from '../utils/format'

const TotalIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M1 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4Zm12 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM4 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm13-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM1.75 14.5a.75.75 0 0 0 0 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 0 0-1.5 0v.784a.272.272 0 0 1-.35.25A49.043 49.043 0 0 0 1.75 14.5Z" clipRule="evenodd" />
  </svg>
)

const PaidIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
)

const PendingIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
  </svg>
)

const OverdueIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
  </svg>
)

export default function Dashboard() {
  const recent = INVOICES.slice(0, 5)

  const totalAmt   = INVOICES.reduce((s, i) => s + i.amount, 0)
  const paidAmt    = INVOICES.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const pendingAmt = INVOICES.filter((i) => i.status === 'Pending').reduce((s, i) => s + i.amount, 0)
  const overdueAmt = INVOICES.filter((i) => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0)

  const stats = [
    {
      label: "Total Invoiced",
      value: fmt(totalAmt),
      change: "+12% this month",
      changeType: "up",
      icon: <TotalIcon />,
      accent: "indigo",
    },
    {
      label: "Paid",
      value: fmt(paidAmt),
      change: `${INVOICES.filter((i) => i.status === 'Paid').length} invoices`,
      changeType: "neutral",
      icon: <PaidIcon />,
      accent: "emerald",
    },
    {
      label: "Pending",
      value: fmt(pendingAmt),
      change: `${INVOICES.filter((i) => i.status === 'Pending').length} invoices`,
      changeType: "neutral",
      icon: <PendingIcon />,
      accent: "amber",
    },
    {
      label: "Overdue",
      value: fmt(overdueAmt),
      change: `${INVOICES.filter((i) => i.status === 'Overdue').length} invoices`,
      changeType: "down",
      icon: <OverdueIcon />,
      accent: "red",
    },
  ]

  return (
    <div className="p-8 space-y-8">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((s) => (
          <StateCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Recent invoices ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Recent invoices</h2>
            <p className="text-xs text-gray-400 mt-0.5">Your latest transactions at a glance</p>
          </div>
          <Link
            to="/invoices"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Invoice', 'Client', 'Issued', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((inv, i) => (
                <tr
                  key={inv.id}
                  className={`hover:bg-indigo-50/40 transition-colors cursor-pointer ${i === recent.length - 1 ? '[&>td]:border-0' : ''}`}
                >
                  <td className="table-td">
                    <span className="font-semibold text-indigo-600">{inv.id}</span>
                  </td>
                  <td className="table-td font-medium text-gray-800">{inv.client}</td>
                  <td className="table-td">{fmtDate(inv.issued)}</td>
                  <td className="table-td font-semibold text-gray-900">{fmt(inv.amount)}</td>
                  <td className="table-td"><Badge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Revenue chart ── */}
      <div>
        <div className="mb-4">
          <h2 className="text-[15px] font-bold text-gray-900">Revenue trend</h2>
          <p className="text-xs text-gray-400 mt-0.5">Last 6 months performance</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <RevenueChart />
        </div>
      </div>

    </div>
  )
}