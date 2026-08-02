import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { formatCurrency, formatDate, StatusBadge } from '../utils/helpers';
import { paymentAPI } from '../services/api';
import { useApp } from '../context/useApp';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { invoices = [] } = useApp();

  const normalizedInvoices = useMemo(() => {
    return invoices.map((invoice) => ({
      ...invoice,
      normalizedStatus: invoice.status?.toLowerCase(),
      normalizedAmount: Number(invoice.totalAmount || invoice.amount || 0),
    }));
  }, [invoices]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await paymentAPI.getAll();
        setPayments(response.data || []);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Calculate revenue data from invoices
  const revenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = {};

    months.forEach((month, idx) => {
      monthlyData[idx] = { month, revenue: 0 };
    });

    normalizedInvoices.forEach(invoice => {
      const invoiceStatus = invoice.normalizedStatus;
      if (invoiceStatus === 'paid' && (invoice.issueDate || invoice.createdAt)) {
        const date = new Date(invoice.issueDate || invoice.createdAt);
        const monthIdx = date.getMonth();
        if (monthlyData[monthIdx]) {
          monthlyData[monthIdx].revenue += invoice.normalizedAmount;
        }
      }
    });

    return Object.values(monthlyData);
  }, [normalizedInvoices]);

  const pendingInvoices = useMemo(() => {
    return normalizedInvoices.filter(invoice => invoice.normalizedStatus === 'pending');
  }, [normalizedInvoices]);

  const paidInvoices = useMemo(() => {
    return normalizedInvoices.filter(invoice => invoice.normalizedStatus === 'paid');
  }, [normalizedInvoices]);

  const total = paidInvoices.reduce((sum, invoice) => sum + invoice.normalizedAmount, 0);
  const completed = paidInvoices.length;
  const pending = pendingInvoices.reduce((sum, invoice) => sum + (invoice.totalAmount || invoice.amount || 0), 0);

  const recentTransactions = useMemo(() => {
    if (payments.length > 0) {
      return payments;
    }

    return [...normalizedInvoices]
      .sort((a, b) => new Date(b.createdAt || b.issueDate || 0) - new Date(a.createdAt || a.issueDate || 0))
      .slice(0, 5)
      .map((invoice) => ({
        id: invoice._id,
        invoice: `#${invoice._id?.slice(-6).toUpperCase()}`,
        client: invoice.clientId?.name || invoice.clientName || 'N/A',
        amount: invoice.normalizedAmount,
        method: invoice.normalizedStatus === 'paid' ? 'Invoice Payment' : 'Invoice Pending',
        date: invoice.issueDate || invoice.createdAt,
        status: invoice.normalizedStatus || 'pending',
      }));
  }, [payments, normalizedInvoices]);

  const methodColors = {
    'Bank Transfer': 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300',
    'Credit Card': 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300',
    'Wire Transfer': 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300',
    'PayPal': 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300',
  };

  return (
    <DashboardLayout title="Payments">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Received', value: formatCurrency(total), icon: DollarSign, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/50' },
              { label: 'Paid Invoices', value: completed, subValue: formatCurrency(total), icon: CheckCircle, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
              { label: 'Pending', value: formatCurrency(pending), subValue: `${pendingInvoices.length} invoice${pendingInvoices.length === 1 ? '' : 's'} pending`, icon: Clock, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50' },
              { label: 'Transactions', value: recentTransactions.length, icon: TrendingUp, color: 'text-violet-500 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/50' },
            ].map(({ label, value, subValue, icon: Icon, color, bg }, i) => (
              <motion.div 
                key={label} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs"
              >
                <div className={`${bg} p-2.5 rounded-xl w-fit mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
                {subValue && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">{subValue}</p>}
              </motion.div>
            ))}
          </div>

          {/* Mini Revenue Bar Chart */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Payment Volume (Last 6 Months)
            </h3>
            <div className="flex items-end gap-2 h-24 pt-2">
              {revenueData.slice(-6).map((d) => {
                const max = Math.max(...revenueData.slice(-6).map(x => x.revenue)) || 1;
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div 
                      className="w-full bg-indigo-600 dark:bg-indigo-500 rounded-t-lg transition-all min-h-[4px]" 
                      style={{ height: `${(d.revenue / max) * 100}%` }} 
                    />
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Recent Transactions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {['Transaction ID', 'Invoice', 'Client', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                  {recentTransactions.map((transaction, i) => (
                    <motion.tr 
                      key={transaction.id || `${transaction.invoice}-${i}`} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-sm font-mono font-medium text-indigo-600 dark:text-indigo-400">
                        {transaction.id?.slice(-6).toUpperCase() || transaction.invoice}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-300">{transaction.invoice}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-100">{transaction.client}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(transaction.amount)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${methodColors[transaction.method] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                          {transaction.method}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400">{formatDate(transaction.date)}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={transaction.status} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Invoices Table */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>
                Pending Invoices
              </h3>
              <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">{pendingInvoices.length} pending</span>
            </div>
            {pendingInvoices.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No pending invoices right now.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      {['Invoice', 'Client', 'Amount', 'Due Date', 'Status'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {pendingInvoices.map((invoice) => (
                      <tr key={invoice._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3.5 text-sm font-mono font-medium text-indigo-600 dark:text-indigo-400">
                          {invoice._id?.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300">
                          {invoice.clientId?.name || invoice.clientName || 'N/A'}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(invoice.totalAmount || invoice.amount || 0)}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400">{formatDate(invoice.dueDate)}</td>
                        <td className="px-4 py-3.5"><StatusBadge status={invoice.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}