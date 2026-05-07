import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, Globe, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { navigate('/dashboard'); }, 1200);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden" style={{background:'linear-gradient(135deg,#4338ca 0%,#6366f1 40%,#8b5cf6 70%,#a78bfa 100%)'}}>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{fontFamily:'Syne,sans-serif'}}>InvoiceAI</span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{fontFamily:'Syne,sans-serif'}}>
                Invoice smarter,<br />get paid faster.
              </h2>
              <p className="text-indigo-200 text-lg leading-relaxed">Manage your entire billing workflow with AI-powered automation and real-time insights.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10 space-y-3">
              {['$2.4M+ Revenue tracked', '10K+ Invoices generated', '99.9% Uptime guaranteed'].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 text-white/90 text-sm">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</div>
                  {s}
                </div>
              ))}
            </motion.div>
          </div>
          <div className="flex -space-x-2">
            {['AC','JD','MK','PL'].map((a,i) => (
              <div key={i} className="w-9 h-9 gradient-brand rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">{a}</div>
            ))}
            <div className="w-9 h-9 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">+8K</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>InvoiceAI</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{fontFamily:'Syne,sans-serif'}}>Welcome back</h1>
          <p className="text-slate-500 mb-8">Sign in to your account to continue</p>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[{ Icon: Globe, label: 'Google' }, { Icon: User, label: 'GitHub' }].map(({ Icon, label }) => (
              <button key={label} className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-500">or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" placeholder="john@company.com" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" checked={form.remember}
                onChange={e => setForm({ ...form, remember: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 accent-indigo-600" />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember me for 30 days</label>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 gradient-brand text-white rounded-xl font-medium text-sm transition-all hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? (
                <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (<>Sign in <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-700">Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
