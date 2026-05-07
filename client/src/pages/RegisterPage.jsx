import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI, setToken } from '../services/api';

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '' });
  const navigate = useNavigate();

  const passwordStrength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = passwordStrength(form.password);
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register(form.email, form.password, form.name);
      if (response.data?.token) {
        setToken(response.data.token);
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex flex-col w-2/5 relative overflow-hidden" style={{background:'linear-gradient(135deg,#312e81 0%,#4f46e5 50%,#7c3aed 100%)'}}>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:`radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`, backgroundSize:'40px 40px'}} />
        <div className="relative z-10 flex flex-col h-full p-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{fontFamily:'Syne,sans-serif'}}>InvoiceAI</span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-4" style={{fontFamily:'Syne,sans-serif'}}>Start for free.<br />Scale as you grow.</h2>
            <p className="text-indigo-200 mb-8">Join 10,000+ businesses using InvoiceAI to automate their billing.</p>
            <div className="space-y-3">
              {['Free 14-day trial, no credit card', 'Unlimited invoices & clients', 'AI-powered invoice generation', '24/7 priority support'].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-white/90 text-sm">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{fontFamily:'Syne,sans-serif'}}>Create your account</h1>
          <p className="text-slate-500 mb-8">Start your 14-day free trial, no credit card required</p>

          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input required placeholder="John Doe" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
                <input placeholder="Acme Corp" value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Email</label>
              <input type="email" required placeholder="john@company.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required placeholder="Create a strong password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColors[strength - 1] : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Password strength: <span className="font-medium">{strengthLabels[strength - 1] || 'Too short'}</span></p>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500">
              By signing up, you agree to our{' '}
              <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
            </p>
            <button type="submit" disabled={loading}
              className="w-full py-3 gradient-brand text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
              {loading ? <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <> Create account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
