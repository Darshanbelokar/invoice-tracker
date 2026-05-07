import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";

const EMPTY_ITEM = { name: "", quantity: 1, price: "" };

export default function EditInvoiceModal({ open, invoice, onClose, onSave }) {
  const { clients, updateInvoice } = useApp();
  const [form, setForm] = useState({
    client: "",
    due: "",
    items: [],
    tax: 0,
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (invoice && open) {
      setForm({
        client: invoice.clientId?._id || "",
        due: invoice.dueDate ? invoice.dueDate.split("T")[0] : "",
        items: invoice.items?.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })) || [{ ...EMPTY_ITEM }],
        tax: 0,
        status: invoice.status?.toLowerCase() || "pending",
      });
    }
  }, [invoice, open]);

  const subtotal = form.items.reduce(
    (s, i) => s + (Number(i.quantity) * Number(i.price) || 0),
    0
  );
  const tax = subtotal * (form.tax / 100);
  const total = subtotal + tax;

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

  const handleSubmit = async () => {
    if (!form.client || !form.due) {
      setError("Please select a client and due date");
      return;
    }
    if (form.items.some((i) => !i.name || !i.price)) {
      setError("Please fill in all line items");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const invoiceData = {
        clientId: form.client,
        dueDate: form.due,
        items: form.items.map(item => ({
          name: item.name,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
        totalAmount: total,
        status: form.status,
      };
      await updateInvoice(invoice._id, invoiceData);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update invoice");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Edit Invoice
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Update invoice details below
            </p>
          </div>
          <button 
            type="button"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-5 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Client + Due Date + Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Client</label>
              <select
                className="form-input"
                value={form.client}
                onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
                disabled={loading}
              >
                <option value="">Select client…</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={form.due}
                onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                disabled={loading}
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">
                Line Items
              </label>
              <button
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1 transition-colors disabled:opacity-50"
                onClick={addItem}
                disabled={loading}
              >
                <Plus size={14} /> Add item
              </button>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-2">
              <span className="col-span-6">Description</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-3">Rate ($)</span>
              <span className="col-span-1" />
            </div>

            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    className="form-input col-span-6 text-sm disabled:opacity-50"
                    placeholder="Service description"
                    value={item.name}
                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                    disabled={loading}
                  />
                  <input
                    className="form-input col-span-2 text-sm text-center disabled:opacity-50"
                    type="number" 
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                    disabled={loading}
                  />
                  <input
                    className="form-input col-span-3 text-sm disabled:opacity-50"
                    type="number" 
                    placeholder="0"
                    value={item.price}
                    onChange={(e) => updateItem(idx, "price", e.target.value)}
                    disabled={loading}
                  />
                  <button
                    className="col-span-1 flex items-center justify-center h-8 w-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    onClick={() => removeItem(idx)}
                    disabled={loading}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
            <span className="text-sm font-semibold text-gray-600">
              Total Amount
            </span>
            <span className="text-xl font-bold text-gray-900">
              ${total.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
