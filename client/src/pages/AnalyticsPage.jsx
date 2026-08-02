import { useMemo } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { formatCurrency } from '../utils/helpers';
import { useApp } from '../context/useApp';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const { invoices = [], clients = [], loading } = useApp();

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
      const amt = Number(invoice.totalAmount || invoice.amount || 0);
      const status = invoice.status?.toLowerCase();

      if (status === 'paid') {
        paidCount++;
        paidAmount += amt;
        totalRevenue += amt;
        if (invoice.issuedDate || invoice.createdAt) {
          const date = new Date(invoice.issuedDate || invoice.createdAt);
          const monthIdx = date.getMonth();
          if (monthlyData[monthIdx]) {
            monthlyData[monthIdx].revenue += amt;
          }
        }
      } else if (status === 'pending') {
        pendingCount++;
        pendingAmount += amt;
      } else if (status === 'overdue') {
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
      const name = invoice.clientId?.name || invoice.clientName || 'Unknown Client';
      const amt = Number(invoice.totalAmount || invoice.amount || 0);
      if (!clientMap[name]) {
        clientMap[name] = 0;
      }
      clientMap[name] += amt;
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

  const max = Math.max(...revenueData.map(d => Math.max(d.revenue, d.target))) || 1;

  return (
    <DashboardLayout title="Analytics">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'YTD Revenue', value: formatCurrency(stats.totalRevenue), sub: '+18.4% vs last year', color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Collection Rate', value: '87.3%', sub: '+2.1% this month', color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Avg Days to Pay', value: '14.2d', sub: '-3.4 days improved', color: 'text-violet-600 dark:text-violet-400' },
              { label: 'Outstanding AR', value: formatCurrency(stats.pendingAmount), sub: `Across ${stats.pendingInvoices} invoices`, color: 'text-amber-600 dark:text-amber-400' },
            ].map(({ label, value, sub, color }, i) => (
              <motion.div 
                key={label} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs"
              >
                <p className={`text-2xl font-bold ${color}`} style={{ fontFamily: 'Syne, sans-serif' }}>
                  {value}
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">{label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Full Year Chart */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>
                Annual Revenue Trend
              </h3>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-medium">
                +18.4% YoY
              </span>
            </div>
            <div className="flex items-end gap-2 h-48">
              {revenueData.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end gap-0.5 h-40">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${(d.revenue / max) * 100}%` }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="flex-1 bg-indigo-600 dark:bg-indigo-500 rounded-t-lg min-h-[2px]" 
                    />
                    <div 
                      className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg min-h-[2px]" 
                      style={{ height: `${(d.target / max) * 100}%` }} 
                    />
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Invoice Status Breakdown */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>
                Invoice Status Breakdown
              </h3>
              <div className="space-y-4">
                {statusBreakdown.map(({ label, value, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
                      <span className="text-slate-500 dark:text-slate-400">{value} invoices ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${pct}%` }} 
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full ${color} rounded-full`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Clients */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>
                Top Clients by Revenue
              </h3>
              {topClients.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No client revenue data available.</p>
              ) : (
                <div className="space-y-4">
                  {topClients.map(({ name, amount, pct }, i) => (
                    <div key={name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{name}</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${pct}%` }} 
                          transition={{ duration: 0.8, delay: i * 0.15 }}
                          className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}