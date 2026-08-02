import { useState } from 'react';
import { Search, Bell, Menu, Plus, Sun, Moon, ChevronDown } from 'lucide-react';
import { useApp } from '../context/useApp';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';

export default function Topbar({ title, onCreateInvoice }) {
  const { isDark, toggleDark, setSidebarOpen, user, setUser } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { text: 'INV-006 is overdue', time: '1h ago', type: 'warning' },
    { text: 'Payment received ₹22,000', time: '5h ago', type: 'success' },
    { text: 'New client Oscorp added', time: '2d ago', type: 'info' },
  ];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-20 shadow-sm transition-colors">
      <button
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1
        className="text-lg font-semibold text-slate-900 dark:text-slate-100 hidden sm:block"
        style={{ fontFamily: 'Syne,sans-serif' }}
      >
        {title}
      </h1>

      <div className="flex-1 max-w-md mx-auto lg:mx-0 lg:ml-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            placeholder="Search invoices, clients..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">

        <button
          onClick={toggleDark}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setShowNotif(!showNotif);
              setShowProfile(false);
            }}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-12 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 transition-colors"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Notifications
                  </p>
                </div>

                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex gap-3"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        n.type === 'warning'
                          ? 'bg-amber-500'
                          : n.type === 'success'
                          ? 'bg-emerald-500'
                          : 'bg-indigo-500'
                      }`}
                    />

                    <div>
                      <p className="text-sm text-slate-800 dark:text-slate-200">
                        {n.text}
                      </p>

                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {n.time}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onCreateInvoice || (() => navigate('/invoices/create'))}
          className="btn-primary text-sm px-4 py-2 hidden sm:inline-flex"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 gradient-brand rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {user?.name
                ? user.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                : 'JD'}
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-12 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 transition-colors"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {user?.name || 'John Doe'}
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {user?.email || 'john@company.com'}
                  </p>
                </div>

                {['Profile Settings', 'Company Details', 'Billing'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      navigate('/settings');
                      setShowProfile(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {item}
                  </button>
                ))}

                <div className="border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={async () => {
                      await authAPI.logout();
                      setUser(null);
                      setShowProfile(false);
                      navigate('/login', { replace: true });
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}