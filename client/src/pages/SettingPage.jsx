import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { User, Lock, Bell, Building2, Palette, Sun, Moon, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

function ProfileTab() {
  const [form, setForm] = useState({ firstName: 'John', lastName: 'Doe', email: 'john@company.com', phone: '+1 555-0100', timezone: 'UTC-5' });
  const [saved, setSaved] = useState(false);
  const save = (e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <form onSubmit={save} className="space-y-5 max-w-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center text-white text-xl font-bold">JD</div>
        <div>
          <button type="button" className="btn-secondary text-xs px-3 py-1.5">Change Avatar</button>
          <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 5MB</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
          <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="input-field" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
          <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="input-field" /></div>
      </div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" /></div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
        <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" /></div>
      <button type="submit" className={`btn-primary transition-all ${saved ? 'bg-emerald-500 !from-emerald-500 !to-emerald-600' : ''}`}>
        {saved ? <><Check className="w-4 h-4"/>Saved!</> : 'Save Changes'}
      </button>
    </form>
  );
}

function SecurityTab() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  return (
    <form className="space-y-4 max-w-lg">
      <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
        <input type="password" value={form.current} onChange={e => setForm({...form, current: e.target.value})} placeholder="••••••••" className="input-field" /></div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
        <input type="password" value={form.newPass} onChange={e => setForm({...form, newPass: e.target.value})} placeholder="••••••••" className="input-field" /></div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
        <input type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} placeholder="••••••••" className="input-field" /></div>
      <button type="submit" className="btn-primary">Update Password</button>
    </form>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    invoiceSent: true, paymentReceived: true, overdueAlert: true, weeklyReport: false, monthlyReport: true,
  });
  const items = [
    { key: 'invoiceSent', label: 'Invoice Sent', desc: 'When an invoice is sent to a client' },
    { key: 'paymentReceived', label: 'Payment Received', desc: 'When a payment is recorded' },
    { key: 'overdueAlert', label: 'Overdue Alerts', desc: 'When an invoice becomes overdue' },
    { key: 'weeklyReport', label: 'Weekly Report', desc: 'Summary of activity each week' },
    { key: 'monthlyReport', label: 'Monthly Report', desc: 'Full monthly analytics report' },
  ];
  return (
    <div className="space-y-3 max-w-lg">
      {items.map(({ key, label, desc }) => (
        <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div><p className="text-sm font-medium text-slate-900">{label}</p><p className="text-xs text-slate-500">{desc}</p></div>
          <button onClick={() => setPrefs(p => ({...p, [key]: !p[key]}))}
            className={`relative w-10 h-5.5 rounded-full transition-colors ${prefs[key] ? 'bg-indigo-500' : 'bg-slate-200'}`}
            style={{height:'22px', minWidth:'40px'}}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      ))}
    </div>
  );
}

function AppearanceTab() {
  const { isDark, toggleDark } = useApp();
  return (
    <div className="max-w-lg space-y-4">
      <p className="text-sm font-medium text-slate-700">Theme</p>
      <div className="grid grid-cols-2 gap-3">
        {[{ label: 'Light', icon: Sun, value: false }, { label: 'Dark', icon: Moon, value: true }].map(({ label, icon: Icon, value }) => (
          <button key={label} onClick={() => isDark !== value && toggleDark()}
            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${isDark === value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
            <Icon className={`w-5 h-5 ${isDark === value ? 'text-indigo-600' : 'text-slate-500'}`} />
            <span className={`font-medium text-sm ${isDark === value ? 'text-indigo-700' : 'text-slate-700'}`}>{label}</span>
            {isDark === value && <Check className="w-4 h-4 text-indigo-500 ml-auto" />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const tabContent = { profile: <ProfileTab />, security: <SecurityTab />, notifications: <NotificationsTab />, company: <ProfileTab />, appearance: <AppearanceTab /> };

  return (
    <DashboardLayout title="Settings">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="w-full lg:w-52 flex-shrink-0">
          <div className="card p-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${activeTab === id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 card">
          <h2 className="text-lg font-semibold text-slate-900 mb-6" style={{fontFamily:'Syne,sans-serif'}}>
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            {tabContent[activeTab]}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
