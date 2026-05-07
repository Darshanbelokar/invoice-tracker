import { useState } from 'react';
import { MoreVertical, Eye, Edit, Trash2, Download, Send, ChevronUp, ChevronDown, Mail, X, CheckCircle2 } from 'lucide-react';
import { StatusBadge, formatCurrency, formatDate } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { pdfAPI, emailAPI } from '../services/api';
import EditInvoiceModal from './EditInvoiceModal';
function PreviewModal({ isOpen, invoice, onClose }) {
  const { updateInvoice } = useApp();
  const [updating, setUpdating] = useState(false);

  const handleMarkAsPaid = async () => {
    setUpdating(true);
    try {
      await updateInvoice(invoice._id, {
        clientId: invoice.clientId?._id,
        items: invoice.items,
        totalAmount: invoice.totalAmount,
        dueDate: invoice.dueDate,
        status: 'paid'
      });
      onClose();
    } catch (err) {
      alert('Failed to update invoice: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">Invoice Preview</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-slate-500">Invoice ID</p><p className="font-semibold text-slate-900">{invoice._id?.slice(-6).toUpperCase()}</p></div>
            <div><p className="text-xs text-slate-500">Client</p><p className="font-semibold text-slate-900">{invoice.clientId?.name}</p></div>
            <div><p className="text-xs text-slate-500">Amount</p><p className="font-semibold text-slate-900">{formatCurrency(invoice.totalAmount)}</p></div>
            <div><p className="text-xs text-slate-500">Due Date</p><p className="font-semibold text-slate-900">{formatDate(invoice.dueDate)}</p></div>
            <div><p className="text-xs text-slate-500">Status</p><StatusBadge status={invoice.status} /></div>
            <div><p className="text-xs text-slate-500">Email</p><p className="font-semibold text-slate-900">{invoice.clientId?.email}</p></div>
          </div>
          <div className="border-t pt-4">
            <p className="text-xs text-slate-500 mb-2">Items</p>
            <div className="space-y-2">
              {invoice.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-slate-600">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatCurrency(item.quantity * item.price)}</span>
                </div>
              ))}
            </div>
          </div>
          {invoice.status?.toLowerCase() !== 'paid' && (
            <div className="border-t pt-4 flex gap-2">
              <button
                onClick={handleMarkAsPaid}
                disabled={updating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Paid
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SendEmailModal({ isOpen, invoice, onClose }) {
  const [email, setEmail] = useState(invoice?.clientId?.email || '');
  const [subject, setSubject] = useState(`Invoice ${invoice?._id?.slice(-6).toUpperCase()} from Invoicely`);
  const [message, setMessage] = useState(`Hi ${invoice?.clientId?.name},\n\nPlease find attached your invoice for ₹${invoice?.totalAmount}.\n\nBest regards`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    setLoading(true);
    setError('');
    try {
      await emailAPI.sendInvoice(invoice._id, email);
      alert('Email sent successfully!');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Send Invoice</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">To</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={loading}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} disabled={loading}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
            <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} disabled={loading}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:opacity-50" />
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <button onClick={onClose} disabled={loading} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleSend} disabled={loading} className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ActionMenu({ invoice, onClose, onDelete, onPreview, onSendEmail, onEdit }) {
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      pdfAPI.download(invoice._id);
      onClose();
    } catch (error) {
      alert('Failed to download PDF: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { icon: Eye, label: 'Preview', action: () => { onPreview(invoice); onClose(); } },
    { icon: Edit, label: 'Edit', action: () => { onEdit(invoice); onClose(); } },
    { icon: Send, label: 'Send Email', action: () => { onSendEmail(invoice); onClose(); } },
    { icon: Download, label: 'Download PDF', action: handleDownloadPDF },
    { icon: Trash2, label: 'Delete', action: () => { onDelete(invoice._id); onClose(); }, danger: true },
  ];
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
      {actions.map(({ icon: Icon, label, action, danger }) => (
        <button key={label} onClick={action} disabled={loading}
          className={`flex items-center gap-2.5 px-4 py-3 text-sm w-full text-left transition-colors hover:bg-slate-50 disabled:opacity-50 ${danger ? 'text-red-600 hover:!bg-red-50' : 'text-slate-700'}`}>
          <Icon className="w-4 h-4" />{label}
        </button>
      ))}
    </motion.div>
  );
}

export default function InvoiceTable({ invoices: propInvoices, compact }) {
  const { invoices: ctxInvoices, deleteInvoice } = useApp();
  const data = propInvoices || ctxInvoices;
  const [openMenu, setOpenMenu] = useState(null);
  const [sortField, setSortField] = useState('_id');
  const [sortDir, setSortDir] = useState('asc');
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [emailInvoice, setEmailInvoice] = useState(null);
  const [editInvoice, setEditInvoice] = useState(null);

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
    ? [{ key: '_id', label: 'Invoice' }, { key: 'clientId', label: 'Client' }, { key: 'totalAmount', label: 'Amount' }, { key: 'status', label: 'Status' }]
    : [{ key: '_id', label: 'Invoice' }, { key: 'clientId', label: 'Client' }, { key: 'totalAmount', label: 'Amount' }, { key: 'dueDate', label: 'Due Date' }, { key: 'status', label: 'Status' }];

  return (
    <div className="overflow-visible">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            {cols.map(({ key, label }) => (
              <th key={key} onClick={() => sort(key)}
                className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none">
                {label}<SortIcon field={key} />
              </th>
            ))}
            <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sorted.map((inv, i) => (
            <motion.tr key={inv._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="hover:bg-slate-50/80 transition-colors group">
              <td className="px-6 py-5">
                <span className="text-sm font-medium text-indigo-600 font-mono">{inv._id?.slice(-6).toUpperCase()}</span>
              </td>
              <td className="px-6 py-5">
                <div>
                  <p className="text-sm font-medium text-slate-900">{inv.clientId?.name || 'N/A'}</p>
                  {!compact && <p className="text-xs text-slate-400">{inv.clientId?.email || ''}</p>}
                </div>
              </td>
              <td className="px-6 py-5">
                <span className="text-sm font-semibold text-slate-900">{formatCurrency(inv.totalAmount)}</span>
              </td>
              {!compact && (
                <td className="px-6 py-5">
                  <span className={`text-sm ${inv.status === 'overdue' ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                    {formatDate(inv.dueDate)}
                  </span>
                </td>
              )}
              <td className="px-6 py-5"><StatusBadge status={inv.status} /></td>
              <td className="px-6 py-5 text-right">
                <div className="relative">
                  <button onClick={() => setOpenMenu(openMenu === inv._id ? null : inv._id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {openMenu === inv._id && (
                      <ActionMenu invoice={inv} onClose={() => setOpenMenu(null)} onDelete={deleteInvoice} onPreview={setPreviewInvoice} onSendEmail={setEmailInvoice} onEdit={setEditInvoice} />
                    )}
                  </AnimatePresence>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <PreviewModal isOpen={!!previewInvoice} invoice={previewInvoice} onClose={() => setPreviewInvoice(null)} />
      <SendEmailModal isOpen={!!emailInvoice} invoice={emailInvoice} onClose={() => setEmailInvoice(null)} />
      <EditInvoiceModal open={!!editInvoice} invoice={editInvoice} onClose={() => setEditInvoice(null)} />
    </div>
  );
}
