import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, CreditCard, BarChart2, Settings, LogOut, Zap, X } from 'lucide-react';
import { useApp } from '../context/useApp';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI, clearToken } from '../services/api';

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
  const { user } = useApp();

  const handleLogout = async () => {
    try {
      // 1. Calls API logout which automatically runs clearToken() and dispatches 'auth-changed'
      await authAPI.logout().catch(() => {});
    } finally {
      // 2. Fallback token cleanup to guarantee storage clearance
      clearToken();

      // 3. Close mobile menu & navigate directly to login
      onClose?.();
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-xs">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>
            InvoiceAI
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-500 dark:text-indigo-300' : ''}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-2">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-slate-900 dark:to-slate-800 border border-indigo-100 dark:border-slate-700 transition-colors">
          <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Pro Plan</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Unlimited invoices & clients</p>
          <div className="mt-2 h-1.5 rounded-full bg-indigo-100 dark:bg-slate-700 overflow-hidden">
            <div className="h-full w-3/4 bg-indigo-600 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {user?.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'JD'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user?.name || 'John Doe'}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.email || 'john@company.com'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-all w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
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
      <aside className="hidden lg:flex flex-col w-60 h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 fixed left-0 top-0 z-30 shadow-xs transition-colors">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 z-50 shadow-2xl lg:hidden transition-colors"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}