/**
 * Format a number as Indian Rupees.
 * e.g. 85000 → "₹85,000"
 */
export function fmt(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN')
}

/**
 * Format an ISO date string to a readable form.
 * e.g. "2025-03-10" → "10 Mar 2025"
 */
export function fmtDate(iso) {
  if (!iso || iso === '—') return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Return today's date as an ISO string (YYYY-MM-DD).
 */
export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Return a date N days from today as an ISO string.
 */
export function futureDateISO(days = 15) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/**
 * Resolve a Tailwind badge class pair for a given status string.
 */
const STATUS_CLASSES = {
  Paid:       'bg-green-100 text-green-800',
  Cleared:    'bg-green-100 text-green-800',
  Pending:    'bg-amber-100 text-amber-800',
  Processing: 'bg-amber-100 text-amber-800',
  Overdue:    'bg-red-100 text-red-800',
  Failed:     'bg-red-100 text-red-800',
  Draft:      'bg-gray-100 text-gray-600',
}

export function statusClass(status) {
  return STATUS_CLASSES[status] ?? 'bg-gray-100 text-gray-500'
}