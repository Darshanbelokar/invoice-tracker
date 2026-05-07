import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { formatCurrency, formatDate, StatusBadge } from '../utils/helpers';
import { paymentAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { invoices } = useApp();

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

  const total = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const completed = payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0);
  const pending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0);

  const methodColors = { 'Bank Transfer': 'bg-indigo-50 text-indigo-700', 'Credit Card': 'bg-violet-50 text-violet-700', 'Wire Transfer': 'bg-blue-50 text-blue-700', 'PayPal': 'bg-sky-50 text-sky-700' };

  return (
    <DashboardLayout title="Payments">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Received', value: formatCurrency(total), icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Completed', value: formatCurrency(completed), icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Pending', value: formatCurrency(pending), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Transactions', value: payments.length, icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50' },
        ].map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card">
            <div className={`${bg} p-2.5 rounded-xl w-fit mb-3`}><Icon className={`w-5 h-5 ${color}`}/></div>
            <p className="text-2xl font-bold text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Mini Revenue Bar */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 mb-4" style={{fontFamily:'Syne,sans-serif'}}>Payment Volume (Last 6 Months)</h3>
        <div className="flex items-end gap-2 h-24">
          {revenueData.slice(-6).map((d, i) => {
            const max = Math.max(...revenueData.slice(-6).map(x => x.revenue));
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full gradient-brand rounded-t-lg transition-all" style={{ height: `${(d.revenue / max) * 80}px` }} />
                <span className="text-xs text-slate-400">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 mb-4" style={{fontFamily:'Syne,sans-serif'}}>Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Transaction ID','Invoice','Client','Amount','Method','Date','Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-mono font-medium text-indigo-600">{p.id}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{p.invoice}</td>
                  <td className="px-4 py-3.5 text-sm font-medium text-slate-900">{p.client}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-slate-900">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${methodColors[p.method] || 'bg-slate-100 text-slate-600'}`}>{p.method}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{formatDate(p.date)}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </DashboardLayout>
  );
}
