import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-white">
              <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM11.5 9v6M8.5 12h6" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-900">Invoicely</span>
        </div>

        {/* Page content */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}