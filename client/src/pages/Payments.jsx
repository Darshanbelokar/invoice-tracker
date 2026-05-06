import Badge from '../components/Badge'
import StateCard from '../components/StateCard'
import { PAYMENTS } from '../data/mockData'
import { fmt, fmtDate } from '../utils/format'

export default function Payments() {
  const cleared     = PAYMENTS.filter((p) => p.status === 'Cleared')
  const totalRx     = cleared.reduce((s, p) => s + p.amount, 0)
  const avgPayment  = cleared.length ? Math.round(totalRx / cleared.length) : 0

  return (
    <div className="p-8">
    

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StateCard label="Total received"   value={fmt(totalRx)}      changeType="up"      change={`${cleared.length} cleared`} />
        <StateCard label="Transactions"     value={PAYMENTS.length}   changeType="neutral" />
        <StateCard label="Avg. payment"     value={fmt(avgPayment)}   changeType="neutral" />
      </div>

      {/* Payments Table */}
      <div className="card overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {['Ref', 'Invoice', 'Client', 'Date', 'Method', 'Amount', 'Status'].map((h) => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 text-sm py-12">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No payments recorded yet.
                </td>
              </tr>
            ) : (
              PAYMENTS.map((pay) => (
                <tr key={pay.ref} className="hover:bg-blue-50 transition-colors">
                  <td className="table-td font-semibold text-gray-900">{pay.ref}</td>
                  <td className="table-td text-brand-600 font-medium">{pay.invoice}</td>
                  <td className="table-td text-gray-700">{pay.client}</td>
                  <td className="table-td text-gray-600">{fmtDate(pay.date)}</td>
                  <td className="table-td text-gray-600 capitalize">{pay.method}</td>
                  <td className="table-td font-semibold text-gray-900">{fmt(pay.amount)}</td>
                  <td className="table-td"><Badge status={pay.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {PAYMENTS.length > 0 && (
        <p className="text-xs text-gray-500 mt-4">
          Showing {PAYMENTS.length} payment{PAYMENTS.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}