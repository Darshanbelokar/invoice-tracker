import { useState, useMemo } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';
import InvoiceTable from '../components/InvoiceTable';
import { DollarSign, FileText, Clock, AlertTriangle, Users, Activity } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useApp } from '../context/useApp';
import { motion } from 'framer-motion';
import CreateInvoiceModal from '../components/CreateInvoiceModal';

const activityIcons = {
  send: (
    <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950/50 rounded-full flex items-center justify-center">
      <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
    </div>
  ),
  payment: (
    <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-950/50 rounded-full flex items-center justify-center">
      <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
    </div>
  ),
  alert: (
    <div className="w-7 h-7 bg-red-50 dark:bg-red-950/50 rounded-full flex items-center justify-center">
      <AlertTriangle className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
    </div>
  ),
  user: (
    <div className="w-7 h-7 bg-violet-50 dark:bg-violet-950/50 rounded-full flex items-center justify-center">
      <Users className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
    </div>
  ),
};

export default function DashboardPage() {
  const { invoices = [], clients = [], loading } = useApp();
  const [showCreate, setShowCreate] = useState(false);

  // Calculate stats safely
  const stats = useMemo(() => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
    
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    
    return {
      totalRevenue,
      paidInvoices: paidInvoices.length,
      pendingInvoices: pendingInvoices.length,
      overdueInvoices: overdueInvoices.length,
      totalClients: clients.length,
      totalInvoices: invoices.length,
      pendingAmount,
      revenueGrowth: 18.4,
      avgInvoiceValue: invoices.length > 0 ? totalRevenue / invoices.length : 0,
    };
  }, [invoices, clients]);

  // Generate activities
  const activities = useMemo(() => {
    return invoices.slice(0, 5).map((invoice, idx) => ({
      id: invoice._id || idx,
      type: 'invoice_sent',
      message: `Invoice ${invoice._id?.slice(0, 8) || 'N/A'} sent to ${invoice.clientName || 'Client'}`,
      time: `${(idx + 1) * 2} hours ago`,
      icon: 'send',
    }));
  }, [invoices]);

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), change: '+18.4%', changeType: 'up', icon: DollarSign, color: 'indigo' },
    { title: 'Paid Invoices', value: stats.paidInvoices, change: '+3 this month', changeType: 'up', icon: FileText, color: 'emerald' },
    { title: 'Pending Invoices', value: stats.pendingInvoices, change: formatCurrency(stats.pendingAmount), icon: Clock, color: 'amber' },
    { title: 'Overdue Invoices', value: stats.overdueInvoices, change: 'Needs attention', changeType: 'down', icon: AlertTriangle, color: 'red' },
  ];

  return (
    <DashboardLayout title="Dashboard" topbarProps={{ onCreateInvoice: () => setShowCreate(true) }}>
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((c, i) => (
              <StatCard key={c.title} {...c} index={i} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>

            {/* Quick Stats */}
            <div className="card bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                Quick Stats
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Total Clients', value: stats.totalClients, icon: Users, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/40' },
                  { label: 'Total Invoices', value: stats.totalInvoices, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
                  { label: 'Pending Amount', value: formatCurrency(stats.pendingAmount), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40' },
                  { label: 'Avg Invoice Value', value: formatCurrency(stats.avgInvoiceValue), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className={`${bg} p-1.5 rounded-lg`}>
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Invoices + Activity */}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: "Syne, sans-serif" }}>
                  Recent Invoices
                </h3>
                <a href="/invoices" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                  View all →
                </a>
              </div>
              <InvoiceTable invoices={invoices.slice(0, 5)} compact />
            </div>

            {/* Activity */}
            <div className="card bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: "Syne, sans-serif" }}>
                  Activity
                </h3>
              </div>
              <div className="space-y-4">
                {activities.map((a, i) => (
                  <motion.div 
                    key={a.id} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    {activityIcons[a.icon]}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-tight">{a.message}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{a.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <CreateInvoiceModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
        </div>
      )}
    </DashboardLayout>
  );
}