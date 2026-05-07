import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, CreditCard, BarChart2, Settings, LogOut, Zap, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/payments', icon: CreditCard, label: 'Payments' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

function SidebarContent({ onClose }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center shadow-glow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-700 text-lg text-slate-900" style={{fontFamily:'Syne,sans-serif',fontWeight:700}}>InvoiceAI</span>
        </div>
        {onClose && <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 lg:hidden"><X className="w-4 h-4"/></button>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }>
            {({ isActive }) => (<><Icon className={`w-4 h-4 ${isActive ? 'text-indigo-500' : ''}`} />{label}</>)}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-2">
        <div className="p-3 rounded-xl bg-linear-to-br from-indigo-50 to-violet-50 border border-indigo-100">
          <p className="text-xs font-medium text-indigo-700">Pro Plan</p>
          <p className="text-xs text-slate-500 mt-0.5">Unlimited invoices & clients</p>
          <div className="mt-2 h-1.5 rounded-full bg-indigo-100 overflow-hidden">
            <div className="h-full w-3/4 gradient-brand rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white text-xs font-semibold">JD</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">John Doe</p>
            <p className="text-xs text-slate-400 truncate">john@company.com</p>
          </div>
        </div>
        <button onClick={() => navigate('/login')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all w-full">
          <LogOut className="w-4 h-4" /><span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp();
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-60 h-screen bg-white border-r border-slate-100 fixed left-0 top-0 z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 h-screen w-64 bg-white z-50 shadow-2xl lg:hidden">
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}