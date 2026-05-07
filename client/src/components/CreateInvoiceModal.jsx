import { useState } from 'react';
import Modal from './Modal';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const emptyItem = { description: '', qty: 1, rate: 0 };

export default function CreateInvoiceModal({ isOpen, onClose }) {
  const { clients, addInvoice } = useApp();
  const [form, setForm] = useState({ client: '', due: '', notes: '', tax: 10 });
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addItem = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => setItems(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  const subtotal = items.reduce((s, it) => s + (Number(it.qty) * Number(it.rate)), 0);
  const tax = subtotal * (Number(form.tax) / 100);
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        clientId: form.client,
        items: items.map(item => ({
          name: item.description,
          quantity: Number(item.qty),
          price: Number(item.rate),
        })),
        totalAmount: total,
        dueDate: form.due,
        status: 'Pending'
      };

      console.log(payload);

      await addInvoice(payload);

      onClose();

      setForm({
        client: '',
        due: '',
        notes: '',
        tax: 10
      });

      setItems([{ ...emptyItem }]);

    } catch (error) {
      console.error(error);
      setError(error.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Invoice" size="xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Client</label>
            <select required value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}
              className="input-field bg-white" disabled={loading}>
              <option value="">Select client...</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
            <input type="date" required value={form.due} onChange={e => setForm({ ...form, due: e.target.value })}
              className="input-field" disabled={loading} />
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">Line Items</label>
            <button type="button" onClick={addItem} disabled={loading} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50">
              <Plus className="w-3 h-3" /> Add item
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-center">Rate</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-slate-100 last:border-0 items-center">
                <div className="col-span-6">
                  <input placeholder="Item description..." value={item.description}
                    onChange={e => updateItem(i, 'description', e.target.value)}
                    disabled={loading}
                    className="w-full text-sm border-0 outline-none bg-transparent text-slate-900 placeholder-slate-400 disabled:opacity-50" />
                </div>
                <div className="col-span-2">
                  <input type="number" min="1" value={item.qty}
                    onChange={e => updateItem(i, 'qty', e.target.value)}
                    disabled={loading}
                    className="w-full text-sm text-center border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
                </div>
                <div className="col-span-2">
                  <input type="number" min="0" value={item.rate}
                    onChange={e => updateItem(i, 'rate', e.target.value)}
                    disabled={loading}
                    className="w-full text-sm text-center border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <span className="text-sm font-medium text-slate-900">{formatCurrency(item.qty * item.rate)}</span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)} disabled={loading} className="text-slate-300 hover:text-red-500 ml-1 disabled:opacity-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
            <textarea rows={3} placeholder="Payment terms, special instructions..." value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              disabled={loading}
              className="input-field resize-none disabled:opacity-50" />
          </div>
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 items-center">
              <span>Tax (%)</span>
              <input type="number" value={form.tax} onChange={e => setForm({ ...form, tax: e.target.value })}
                disabled={loading}
                className="w-20 text-sm text-right border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Tax Amount</span><span>{formatCurrency(tax)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-semibold text-slate-900">
              <span>Total</span>
              <span className="text-lg gradient-text">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} disabled={loading} className="btn-secondary disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
