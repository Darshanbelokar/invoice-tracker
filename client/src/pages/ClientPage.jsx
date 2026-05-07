import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Modal from '../components/Modal';
import { Plus, Search, Users, Mail, Phone,Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { StatusBadge } from '../utils/helpers';
import { motion } from 'framer-motion';

function AddClientModal({ isOpen, onClose }) {
  const { addClient } = useApp();
  const [form, setForm] = useState({ name: '', contact: '', email: '', phone: '', country: 'USA' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await addClient({ 
        name: form.name,
        contactPerson: form.contact, 
        email: form.email, 
        phone: form.phone, 
        country: form.country,
        status: 'active' 
      });
      onClose(); 
      setForm({ name: '', contact: '', email: '', phone: '', country: 'USA' });
    } catch (err) {
      setError(err.message || 'Failed to add client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Client">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
          <input required placeholder="Acme Corporation" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} className="input-field" disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact Person</label>
          <input required placeholder="John Smith" value={form.contact}
            onChange={e => setForm({...form, contact: e.target.value})} className="input-field" disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input type="email" required placeholder="billing@acme.com" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} className="input-field" disabled={loading} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
            <input placeholder="+1 555-0100" value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})} className="input-field" disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
            <select value={form.country} onChange={e => setForm({...form, country: e.target.value})}
              className="input-field bg-white" disabled={loading}>
              {['USA','UK','Canada','Australia','Germany','France'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Client'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function ClientsPage() {
  const { clients, invoices } = useApp();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate client stats from invoices
  const getClientStats = (clientId) => {
    const clientInvoices = invoices.filter(inv => inv.clientId === clientId);
    return {
      totalInvoices: clientInvoices.length,
      totalPaid: clientInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.amount || 0), 0)
    };
  };

  const avatarColors = ['from-indigo-500 to-violet-500','from-emerald-500 to-teal-500','from-amber-500 to-orange-500','from-pink-500 to-rose-500','from-blue-500 to-cyan-500','from-purple-500 to-pink-500'];
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <DashboardLayout title="Clients">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9" />
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add Client</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Clients', value: clients.length, icon: Users },
          { label: 'Active Clients', value: clients.filter(c=>c.status==='active').length, icon: Users },
          { label: 'Total Revenue', value: formatCurrency(clients.reduce((s,c)=>s+((invoices.filter(inv => inv.clientId === c._id && inv.status === 'paid').reduce((sum, inv) => sum + (inv.amount || 0), 0)) || 0),0)), icon: Users },
        ].map(({ label, value, icon: Icon }, i) => (
          <div key={label} className="card text-center">
            <p className="text-2xl font-bold text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Client Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((client, i) => {
          const stats = getClientStats(client._id);
          return (
            <motion.div key={client._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${avatarColors[i % avatarColors.length]} rounded-xl flex items-center justify-center text-white text-sm font-bold`}>
                    {getInitials(client.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{client.name}</p>
                    <p className="text-xs text-slate-400">{client.contactPerson}</p>
                  </div>
                </div>
                <StatusBadge status={client.status} />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5" />{client.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="w-3.5 h-3.5" />{client.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Globe className="w-3.5 h-3.5" />{client.country}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>{stats.totalInvoices}</p>
                  <p className="text-xs text-slate-500">Invoices</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-indigo-600" style={{fontFamily:'Syne,sans-serif'}}>{formatCurrency(stats.totalPaid)}</p>
                  <p className="text-xs text-slate-500">Total Paid</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AddClientModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
    </DashboardLayout>
  );
}
