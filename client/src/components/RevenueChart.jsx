import { useMemo } from 'react';
import { formatCurrency } from '../utils/helpers';
import { useApp } from '../context/AppContext';

export default function RevenueChart() {
  const { invoices } = useApp();

  // Calculate monthly revenue from invoices
  const revenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = {};

    // Initialize all months with 0
    months.forEach((month, idx) => {
      monthlyData[idx] = { month, revenue: 0, target: 25000 };
    });

    // Calculate revenue from paid invoices
    invoices.forEach(invoice => {
      if (invoice.status === 'paid' && invoice.issuedDate) {
        const date = new Date(invoice.issuedDate);
        const monthIdx = date.getMonth();
        if (monthlyData[monthIdx]) {
          monthlyData[monthIdx].revenue += invoice.amount || 0;
        }
      }
    });

    return Object.values(monthlyData);
  }, [invoices]);

  const max = Math.max(...revenueData.map(d => Math.max(d.revenue, d.target)));
  const months = revenueData.slice(-6);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>Revenue Overview</h3>
          <p className="text-sm text-slate-500 mt-0.5">Monthly revenue vs target</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 gradient-brand rounded-sm" /><span className="text-slate-600">Revenue</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-200 rounded-sm" /><span className="text-slate-600">Target</span></div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-3 h-40">
        {months.map((d, i) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex items-end gap-1 h-32">
              <div className="flex-1 rounded-t-lg gradient-brand transition-all duration-500 opacity-90"
                style={{ height: `${(d.revenue / max) * 100}%`, animationDelay: `${i * 100}ms` }}
                title={formatCurrency(d.revenue)} />
              <div className="flex-1 bg-slate-100 rounded-t-lg"
                style={{ height: `${(d.target / max) * 100}%` }}
                title={formatCurrency(d.target)} />
            </div>
            <span className="text-xs text-slate-400">{d.month}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Total (6 months)</p>
          <p className="text-lg font-bold text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>
            {formatCurrency(months.reduce((s, d) => s + d.revenue, 0))}
          </p>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-medium">+18.4% growth</span>
      </div>
    </div>
  );
}