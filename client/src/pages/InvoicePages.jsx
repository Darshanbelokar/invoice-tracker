import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import InvoiceTable from '../components/InvoiceTable';
import CreateInvoiceModal from '../components/CreateInvoiceModal';
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STATUSES = ['all', 'paid', 'pending', 'overdue', 'draft'];
const PER_PAGE = 5;

export default function InvoicesPage() {
  const { invoices } = useApp();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = invoices.filter(inv =>
    (status === 'all' || inv.status === status) &&
    (inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <DashboardLayout title="Invoices" topbarProps={{ onCreateInvoice: () => setShowCreate(true) }}>
      <div className="card">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input placeholder="Search by client or invoice ID..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-9" />
          </div>
          <div className="flex gap-2">
            <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
              {STATUSES.map(s => (
                <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${status === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {s}
                </button>
              ))}
            </div>
            <button onClick={() => setShowCreate(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> New
            </button>
          </div>
        </div>

        {/* Table */}
        <InvoiceTable invoices={paginated} />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Showing {Math.min((page-1)*PER_PAGE+1, filtered.length)}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 text-slate-600 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({length: totalPages}, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-sm font-medium transition-colors ${page===p ? 'gradient-brand text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 text-slate-600 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <CreateInvoiceModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </DashboardLayout>
  );
}
