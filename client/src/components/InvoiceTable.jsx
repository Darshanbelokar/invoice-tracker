import { useState } from 'react';
import { MoreVertical, Eye, Edit, Trash2, Download, Send, ChevronUp, ChevronDown } from 'lucide-react';
import { StatusBadge, formatCurrency, formatDate } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

function ActionMenu({ invoice, onClose, onDelete }) {
  const actions = [
    { icon: Eye, label: 'Preview', action: () => {} },
    { icon: Edit, label: 'Edit', action: () => {} },
    { icon: Send, label: 'Send Email', action: () => {} },
    { icon: Download, label: 'Download PDF', action: () => {} },
    { icon: Trash2, label: 'Delete', action: () => { onDelete(invoice.id); onClose(); }, danger: true },
  ];
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20">
      {actions.map(({ icon: Icon, label, action, danger }) => (
        <button key={label} onClick={action}
          className={`flex items-center gap-2.5 px-3 py-2.5 text-sm w-full text-left transition-colors ${danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50'}`}>
          <Icon className="w-3.5 h-3.5" />{label}
        </button>
      ))}
    </motion.div>
  );
}

export default function InvoiceTable({ invoices: propInvoices, compact }) {
  const { invoices: ctxInvoices, deleteInvoice } = useApp();
  const data = propInvoices || ctxInvoices;
  const [openMenu, setOpenMenu] = useState(null);
  const [sortField, setSortField] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const sort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const sorted = [...data].sort((a, b) => {
    let v = a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0;
    return sortDir === 'desc' ? -v : v;
  });

  const SortIcon = ({ field }) => (
    <span className="ml-1 inline-flex flex-col opacity-50">
      <ChevronUp className={`w-2.5 h-2.5 ${sortField === field && sortDir === 'asc' ? 'opacity-100' : ''}`} />
      <ChevronDown className={`w-2.5 h-2.5 -mt-1 ${sortField === field && sortDir === 'desc' ? 'opacity-100' : ''}`} />
    </span>
  );

  const cols = compact
    ? [{ key: 'id', label: 'Invoice' }, { key: 'client', label: 'Client' }, { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' }]
    : [{ key: 'id', label: 'Invoice' }, { key: 'client', label: 'Client' }, { key: 'amount', label: 'Amount' }, { key: 'due', label: 'Due Date' }, { key: 'status', label: 'Status' }];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            {cols.map(({ key, label }) => (
              <th key={key} onClick={() => sort(key)}
                className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none">
                {label}<SortIcon field={key} />
              </th>
            ))}
            <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sorted.map((inv, i) => (
            <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="hover:bg-slate-50/80 transition-colors group">
              <td className="px-4 py-3.5">
                <span className="text-sm font-medium text-indigo-600 font-mono">{inv.id}</span>
              </td>
              <td className="px-4 py-3.5">
                <div>
                  <p className="text-sm font-medium text-slate-900">{inv.client}</p>
                  {!compact && <p className="text-xs text-slate-400">{inv.email}</p>}
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm font-semibold text-slate-900">{formatCurrency(inv.amount)}</span>
              </td>
              {!compact && (
                <td className="px-4 py-3.5">
                  <span className={`text-sm ${inv.status === 'overdue' ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                    {formatDate(inv.due)}
                  </span>
                </td>
              )}
              <td className="px-4 py-3.5"><StatusBadge status={inv.status} /></td>
              <td className="px-4 py-3.5 text-right">
                <div className="relative inline-block">
                  <button onClick={() => setOpenMenu(openMenu === inv.id ? null : inv.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {openMenu === inv.id && (
                      <ActionMenu invoice={inv} onClose={() => setOpenMenu(null)} onDelete={deleteInvoice} />
                    )}
                  </AnimatePresence>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
