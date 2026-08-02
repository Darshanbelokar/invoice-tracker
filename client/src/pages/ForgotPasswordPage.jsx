import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setResetUrl('');

    try {
      const response = await authAPI.forgotPassword(email);
      setMessage(response.message || 'Password reset email sent');
      if (response.resetUrl) {
        setResetUrl(response.resetUrl);
      }
    } catch (err) {
      setError(err.message || 'Unable to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>InvoiceAI</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{fontFamily:'Syne,sans-serif'}}>Reset your password</h1>
        <p className="text-slate-500 mb-6">Enter the email address on your account and we’ll send a reset link.</p>

        {message && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-4">{message}</div>}
        {resetUrl && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm mb-4 break-all">
            Reset link: <a href={resetUrl} className="underline">{resetUrl}</a>
          </div>
        )}
        {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="input-field pl-9"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 gradient-brand text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70"
          >
            {loading ? 'Sending...' : <>Send reset link <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Remembered it? <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">Back to login</Link>
        </p>
      </motion.div>
    </div>
  );
}