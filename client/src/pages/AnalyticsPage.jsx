import { useMemo } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { formatCurrency } from '../utils/helpers';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const { invoices, clients, loading } = useApp();

  // Calculate revenue data and stats from invoices
  const { revenueData, stats, statusBreakdown, topClients } = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = {};

    months.forEach((month, idx) => {
      monthlyData[idx] = { month, revenue: 0, target: 25000 };
    });

    // Calculate revenue and status breakdown
    let totalRevenue = 0;
    let paidCount = 0, pendingCount = 0, overdueCount = 0;
    let paidAmount = 0, pendingAmount = 0;

    invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        paidCount++;
        paidAmount += invoice.amount || 0;
        totalRevenue += invoice.amount || 0;
        if (invoice.issuedDate) {
          const date = new Date(invoice.issuedDate);
          const monthIdx = date.getMonth();
          if (monthlyData[monthIdx]) {
            monthlyData[monthIdx].revenue += invoice.amount || 0;
          }
        }
      } else if (invoice.status === 'pending') {
        pendingCount++;
        pendingAmount += invoice.amount || 0;
      } else if (invoice.status === 'overdue') {
        overdueCount++;
      }
    });

    const total = invoices.length;
    const statBreakdown = [
      { label: 'Paid', value: paidCount, pct: total > 0 ? Math.round((paidCount / total) * 100) : 0, color: 'bg-emerald-500' },
      { label: 'Pending', value: pendingCount, pct: total > 0 ? Math.round((pendingCount / total) * 100) : 0, color: 'bg-amber-400' },
      { label: 'Overdue', value: overdueCount, pct: total > 0 ? Math.round((overdueCount / total) * 100) : 0, color: 'bg-red-500' },
    ];

    // Get top clients by total amount
    const clientMap = {};
    invoices.forEach(invoice => {
      if (!clientMap[invoice.clientName]) {
        clientMap[invoice.clientName] = 0;
      }
      clientMap[invoice.clientName] += invoice.amount || 0;
    });

    const topCts = Object.entries(clientMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    const totalTopAmount = topCts.reduce((sum, c) => sum + c.amount, 0);
    const enrichedTopClients = topCts.map(c => ({
      name: c.name,
      amount: c.amount,
      pct: totalTopAmount > 0 ? Math.round((c.amount / totalTopAmount) * 100) : 0,
    }));

    return {
      revenueData: Object.values(monthlyData),
      stats: {
        totalRevenue,
        paidInvoices: paidCount,
        pendingInvoices: pendingCount,
        overdueInvoices: overdueCount,
        pendingAmount,
        totalClients: clients.length,
        totalInvoices: invoices.length,
      },
      statusBreakdown: statBreakdown,
      topClients: enrichedTopClients,
    };
  }, [invoices, clients]);

  const max = Math.max(...revenueData.map(d => Math.max(d.revenue, d.target)));

  return (
    <DashboardLayout title="Analytics">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'YTD Revenue', value: formatCurrency(stats.totalRevenue), sub: '+18.4% vs last year', color: 'text-indigo-600' },
          { label: 'Collection Rate', value: '87.3%', sub: '+2.1% this month', color: 'text-emerald-600' },
          { label: 'Avg Days to Pay', value: '14.2d', sub: '-3.4 days improved', color: 'text-violet-600' },
          { label: 'Outstanding AR', value: formatCurrency(stats.pendingAmount), sub: 'Across 11 invoices', color: 'text-amber-600' },
        ].map(({ label, value, sub, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card">
            <p className={`text-2xl font-bold ${color}`} style={{fontFamily:'Syne,sans-serif'}}>{value}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Full Year Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>Annual Revenue Trend</h3>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-medium">+18.4% YoY</span>
        </div>
        <div className="flex items-end gap-2 h-48">
          {revenueData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex items-end gap-0.5 h-40">
                <motion.div initial={{ height: 0 }} animate={{ height: `${(d.revenue / max) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="flex-1 gradient-brand rounded-t-lg" />
                <div className="flex-1 bg-slate-100 rounded-t-lg" style={{ height: `${(d.target / max) * 100}%` }} />
              </div>
              <span className="text-xs text-slate-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Invoice Status */}
        <div className="card">
          <h3 className="font-semibold text-slate-900 mb-5" style={{fontFamily:'Syne,sans-serif'}}>Invoice Status Breakdown</h3>
          <div className="space-y-4">
            {statusBreakdown.map(({ label, value, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="text-slate-500">{value} invoices ({pct}%)</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full ${color} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="card">
          <h3 className="font-semibold text-slate-900 mb-5" style={{fontFamily:'Syne,sans-serif'}}>Top Clients by Revenue</h3>
          <div className="space-y-4">
            {topClients.map(({ name, amount, pct }, i) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{name}</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.15 }}
                    className="h-full gradient-brand rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        </>
      )}
    </DashboardLayout>
  );
}
