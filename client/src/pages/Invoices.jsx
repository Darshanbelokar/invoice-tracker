import { useState, useMemo } from "react";
import Badge   from "../components/Badge";
import NewInvoiceModal from "../components/NewInvoiceModal";
import { INVOICES } from "../data/mockData";

const STATUS_OPTS = ["all", "paid", "pending", "overdue", "draft"];

export default function Invoices() {
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");
  const [showModal, setShowModal] = useState(false);

  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  const filtered = useMemo(() =>
    INVOICES.filter((inv) => {
      const q = search.toLowerCase();
      const matchSearch =
        inv.client.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q);
      const matchFilter = filter === "all" || inv.status === filter;
      return matchSearch && matchFilter;
    }),
    [search, filter]
  );

  return (
    <div>
    
      <div className="card p-6 animate-fade-up">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-[15px]"
               aria-hidden="true" />
            <input
              className="input-field pl-9 text-[13.5px]"
              placeholder="Search by client or invoice ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status pills */}
          <div className="flex gap-1.5">
            {STATUS_OPTS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={
                  filter === s
                    ? "btn-primary py-2 px-3.5 text-xs capitalize rounded-lg! shadow-none!"
                    : "btn-ghost py-2 px-3.5 text-xs capitalize rounded-lg!"
                }
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <table className="w-full data-table">
          <thead>
            <tr>
              <th className="text-left">Invoice ID</th>
              <th className="text-left">Client</th>
              <th className="text-left">Issued</th>
              <th className="text-left">Due Date</th>
              <th className="text-right">Amount</th>
              <th className="text-center">Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id}>
                <td>
                  <span className="font-mono text-[12.5px] font-semibold text-brand-600">
                    {inv.id}
                  </span>
                </td>
                <td>
                  <div>
                    <p className="text-[13.5px] font-medium text-surface-800">{inv.client}</p>
                    <p className="text-[11.5px] text-surface-400">{inv.email}</p>
                  </div>
                </td>
                <td className="text-surface-400 text-[13px]">{inv.issued}</td>
                <td className="text-surface-400 text-[13px]">{inv.due}</td>
                <td className="text-right font-semibold text-surface-800 text-[13.5px]">
                  {fmt(inv.amount)}
                </td>
                <td className="text-center">
                  <Badge status={inv.status} />
                </td>
                <td>
                  <div className="flex gap-1.5 justify-end">
                    <button className="btn-icon w-7 h-7" title="View">
                      <i className="ti ti-eye text-[13px]" />
                    </button>
                    <button className="btn-icon w-7 h-7" title="PDF">
                      <i className="ti ti-file-type-pdf text-[13px]" />
                    </button>
                    <button className="btn-icon w-7 h-7" title="Send email">
                      <i className="ti ti-send text-[13px]" />
                    </button>
                    <button className="btn-icon w-7 h-7 hover:!bg-rose-50 hover:!text-rose-500 hover:!border-rose-200" title="Delete">
                      <i className="ti ti-trash text-[13px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-3 text-surface-400">
            <i className="ti ti-file-off text-[36px]" />
            <p className="text-sm">No invoices match your search</p>
          </div>
        )}
      </div>

      {showModal && <NewInvoiceModal onClose={() => setShowModal(false)} />}
    </div>
  );
}