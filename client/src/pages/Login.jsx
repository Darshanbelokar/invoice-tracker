import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

// ─── Logo Mark ────────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-[#185FA5] flex items-center justify-center shadow-sm">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
          <rect x="1" y="1" width="6" height="6" rx="1.2" />
          <rect x="9" y="1" width="6" height="6" rx="1.2" />
          <rect x="1" y="9" width="6" height="6" rx="1.2" />
          <rect x="9" y="11.5" width="6" height="1.5" rx="0.75" />
          <rect x="11.5" y="9" width="1.5" height="6" rx="0.75" />
        </svg>
      </div>
      <span className="text-[17px] font-semibold text-gray-900 tracking-tight">Invoicely</span>
    </div>
  )
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({ label, type = 'text', placeholder, icon: Icon, value, onChange, rightEl }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] font-medium text-gray-600">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full py-2.5 text-[13.5px] border border-gray-200 rounded-xl bg-gray-50
            text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30
            focus:border-[#185FA5] transition-all
            ${Icon ? 'pl-10' : 'pl-3.5'} ${rightEl ? 'pr-10' : 'pr-3.5'}`}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
    </div>
  )
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function LoginPage({ onLogin, onGoRegister }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    // Call parent handler (replace with real auth)
    if (onLogin) onLogin({ email })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/40 to-slate-100 flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#185FA5] flex-col justify-between p-10 relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          {/* Grid dots */}
          {Array.from({ length: 12 }).map((_, i) =>
            Array.from({ length: 8 }).map((_, j) => (
              <div
                key={`${i}-${j}`}
                className="absolute w-1 h-1 bg-white rounded-full opacity-40"
                style={{ left: `${i * 8 + 4}%`, top: `${j * 13 + 4}%` }}
              />
            ))
          )}
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <rect x="1" y="1" width="6" height="6" rx="1.2" />
              <rect x="9" y="1" width="6" height="6" rx="1.2" />
              <rect x="1" y="9" width="6" height="6" rx="1.2" />
              <rect x="9" y="11.5" width="6" height="1.5" rx="0.75" />
              <rect x="11.5" y="9" width="1.5" height="6" rx="0.75" />
            </svg>
          </div>
          <span className="text-[17px] font-semibold text-white tracking-tight">Invoicely</span>
        </div>

        {/* Hero text */}
        <div className="relative">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-blue-200 uppercase mb-4">
            Invoice Management
          </p>
          <h2 className="text-[32px] font-bold text-white leading-tight mb-4">
            Manage invoices<br />with zero friction.
          </h2>
          <p className="text-[14px] text-blue-100 leading-relaxed max-w-xs">
            Send professional invoices, track payments, and grow your business — all from one clean dashboard.
          </p>

          {/* Mini stat cards */}
          <div className="flex gap-3 mt-8">
            {[
              { label: 'Invoices sent', value: '12,400+' },
              { label: 'Avg. pay time',  value: '3.2 days' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex-1">
                <p className="text-[20px] font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-blue-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <p className="relative text-[12px] text-blue-200/70 italic">
          "Invoicely cut our billing time by 60%." — Riya, Founder at DesignHive
        </p>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-95">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <LogoMark />
          </div>

          <h1 className="text-[24px] font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-[13.5px] text-gray-500 mb-7">Sign in to your Invoicely account</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <InputField
              label="Email address"
              type="email"
              placeholder="you@company.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            {/* Forgot */}
            <div className="flex justify-end -mt-1">
              <button type="button" className="text-[12.5px] text-[#185FA5] hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-[12.5px] text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 w-full py-2.5 bg-[#185FA5] hover:bg-[#1453919] 
                text-white text-[13.5px] font-semibold rounded-xl transition-all shadow-sm
                disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11.5px] text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google SSO */}
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 w-full py-2.5 border border-gray-200
              bg-white hover:bg-gray-50 rounded-xl text-[13px] font-medium text-gray-700 transition-all shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
              <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.5 35.5 26.9 36 24 36c-5.2 0-9.6-3-11.3-7.2l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.9 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign up link */}
          <p className="text-center text-[13px] text-gray-500 mt-6">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onGoRegister}
              className="text-[#185FA5] font-semibold hover:underline"
            >
              Create one
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}