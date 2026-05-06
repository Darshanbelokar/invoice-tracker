import { useState } from 'react'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'

export default function RegisterPage({ onNavigate }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const passwordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' }
    let score = 0
    if (pwd.length >= 8)            score++
    if (/[A-Z]/.test(pwd))          score++
    if (/[0-9]/.test(pwd))          score++
    if (/[^A-Za-z0-9]/.test(pwd))  score++
    const map = [
      { score: 0, label: '',         color: ''                },
      { score: 1, label: 'Weak',     color: 'bg-red-400'     },
      { score: 2, label: 'Fair',     color: 'bg-amber-400'   },
      { score: 3, label: 'Good',     color: 'bg-blue-400'    },
      { score: 4, label: 'Strong',   color: 'bg-emerald-500' },
    ]
    return map[score]
  }

  const strength = passwordStrength(form.password)

  const validate = () => {
    const e = {}
    if (!form.fullName.trim())                            e.fullName = 'Full name is required'
    if (!form.email.includes('@'))                        e.email = 'Enter a valid email'
    if (form.password.length < 8)                         e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword)           e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((err) => ({ ...err, [e.target.name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Navigate to login after success
      onNavigate('login')
    }, 1500)
  }

  const perks = [
    'No credit card required',
    '14-day free trial',
    'Cancel any time',
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-105 min-w-105 bg-[#185FA5] p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM11.5 9v6M8.5 12h6" />
            </svg>
          </div>
          <span className="text-[16px] font-semibold text-white tracking-tight">Invoicely</span>
        </div>

        {/* Hero text */}
        <div>
          <h2 className="text-[32px] font-bold text-white leading-snug mb-4">
            Get paid faster.<br />
            Stay organised.
          </h2>
          <p className="text-blue-200 text-[14px] leading-relaxed mb-8">
            Create professional invoices, track payments, and manage your clients —
            all in one clean dashboard.
          </p>
          <div className="space-y-3">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check size={11} color="white" strokeWidth={3} />
                </div>
                <span className="text-[13px] text-blue-100">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-[13px] text-blue-100 leading-relaxed mb-3">
            "Invoicely cut our billing time in half. The dashboard is incredibly clean and our clients love the professional invoices."
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/30 text-white text-[11px] font-semibold flex items-center justify-center">
              SP
            </div>
            <div>
              <p className="text-[12px] text-white font-medium">Sneha Patel</p>
              <p className="text-[11px] text-blue-300">Founder, PixelCraft Studio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-100">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-[#185FA5] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM11.5 9v6M8.5 12h6" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-gray-900">Invoicely</span>
          </div>

          <h1 className="text-[24px] font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-[13px] text-gray-500 mb-7">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-[#185FA5] font-medium hover:underline"
            >
              Sign in
            </button>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Full Name */}
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Full name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Aarav Kumar"
                className={`w-full px-3 py-2.5 text-[13px] rounded-lg border bg-white text-gray-900
                  placeholder-gray-400 focus:outline-none focus:ring-1 transition-shadow
                  ${errors.fullName
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-blue-400'}`}
              />
              {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Work email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="aarav@company.com"
                className={`w-full px-3 py-2.5 text-[13px] rounded-lg border bg-white text-gray-900
                  placeholder-gray-400 focus:outline-none focus:ring-1 transition-shadow
                  ${errors.email
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-blue-400'}`}
              />
              {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`w-full px-3 py-2.5 pr-10 text-[13px] rounded-lg border bg-white text-gray-900
                    placeholder-gray-400 focus:outline-none focus:ring-1 transition-shadow
                    ${errors.password
                      ? 'border-red-300 focus:ring-red-300'
                      : 'border-gray-200 focus:ring-blue-400'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors
                          ${i <= strength.score ? strength.color : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Strength: <span className="font-medium text-gray-700">{strength.label}</span>
                  </p>
                </div>
              )}
              {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Confirm password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full px-3 py-2.5 pr-10 text-[13px] rounded-lg border bg-white text-gray-900
                    placeholder-gray-400 focus:outline-none focus:ring-1 transition-shadow
                    ${errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-300'
                      : 'border-gray-200 focus:ring-blue-400'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <p className="text-[12px] text-gray-400 leading-relaxed">
              By creating an account you agree to our{' '}
              <a href="#" className="text-[#185FA5] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#185FA5] hover:underline">Privacy Policy</a>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
                bg-[#185FA5] text-white text-[13.5px] font-semibold
                hover:bg-[#1450888] active:scale-[0.99] transition-all
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <>Create account <ArrowRight size={14} /></>
              )}
            </button>

          </form>
        </div>
      </div>

    </div>
  )
}