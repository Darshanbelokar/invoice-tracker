import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authAPI.resetPassword(token, password);
      setMessage(response.message || 'Password updated successfully');
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      setError(err.message || 'Unable to reset password');
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

        <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{fontFamily:'Syne,sans-serif'}}>Set a new password</h1>
        <p className="text-slate-500 mb-6">Choose a new password for your account.</p>

        {message && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-4">{message}</div>}
        {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a new password"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 gradient-brand text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70"
          >
            {loading ? 'Updating...' : <>Update password <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">Back to login</Link>
        </p>
      </motion.div>
    </div>
  );
}