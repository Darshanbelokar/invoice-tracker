import { useState } from "react";
import { CLIENTS } from "../data/mockData";

const EMPTY_ITEM = { desc: "", qty: 1, rate: "" };

export default function NewInvoiceModal({ onClose }) {
  const [form, setForm] = useState({
    client: "", due: "", items: [{ ...EMPTY_ITEM }],
  });

  const total = form.items.reduce(
    (s, i) => s + (Number(i.qty) * Number(i.rate) || 0),
    0
  );

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));

  const removeItem = (idx) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const updateItem = (idx, key, val) =>
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: val };
      return { ...f, items };
    });

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(18,18,30,0.55)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl animate-scale-in">
       
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-surface-100">
          <div>
            <h2 className="text-[17px] font-display font-bold text-surface-900">
              New Invoice
            </h2>
            <p className="text-xs text-surface-400 mt-0.5">
              Fill in the details below
            </p>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <i className="ti ti-x text-[16px]" />
          </button>
        </div>

        <div className="px-7 py-5 space-y-5">
          {/* Client + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-500 mb-1.5">
                Client
              </label>
              <select
                className="input-field"
                value={form.client}
                onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
              >
                <option value="">Select client…</option>
                {CLIENTS.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-500 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                className="input-field"
                value={form.due}
                onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))}
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-surface-500">
                Line Items
              </label>
              <button
                className="text-[12px] text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1"
                onClick={addItem}
              >
                <i className="ti ti-plus text-[13px]" /> Add item
              </button>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-12 gap-2 text-[10.5px] font-semibold text-surface-400 uppercase tracking-wider px-1 mb-2">
              <span className="col-span-6">Description</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-3">Rate (₹)</span>
              <span className="col-span-1" />
            </div>

            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    className="input-field col-span-6 text-sm"
                    placeholder="Service description"
                    value={item.desc}
                    onChange={(e) => updateItem(idx, "desc", e.target.value)}
                  />
                  <input
                    className="input-field col-span-2 text-sm text-center"
                    type="number" min="1"
                    value={item.qty}
                    onChange={(e) => updateItem(idx, "qty", e.target.value)}
                  />
                  <input
                    className="input-field col-span-3 text-sm"
                    type="number" placeholder="0"
                    value={item.rate}
                    onChange={(e) => updateItem(idx, "rate", e.target.value)}
                  />
                  <button
                    className="col-span-1 flex items-center justify-center h-8 w-8 rounded-lg hover:bg-rose-50 text-surface-300 hover:text-rose-500 transition-colors"
                    onClick={() => removeItem(idx)}
                    aria-label="Remove item"
                  >
                    <i className="ti ti-trash text-[14px]" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-surface-50 border border-surface-200 rounded-xl px-5 py-4">
            <span className="text-sm font-semibold text-surface-500">
              Total Amount
            </span>
            <span className="text-xl font-display font-bold text-surface-900">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button className="btn-ghost flex-1" onClick={onClose}>
              Save as Draft
            </button>
            <button className="btn-primary flex-1" onClick={onClose}>
              <i className="ti ti-send text-[15px]" />
              Send Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}