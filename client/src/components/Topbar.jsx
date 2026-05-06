export default function Topbar({ title, onNewInvoice }) {
  const subtitles = {
    Dashboard: "Welcome back! Here's what's happening with your invoices.",
    Invoices:  'Manage and track all your invoices.',
    Clients:   'View and manage your client relationships.',
    Payments:  'Track all incoming payments and transactions.',
  }

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitles[title] && (
          <p className="text-sm text-gray-400 mt-0.5">{subtitles[title]}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
       
        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-gray-400">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-300">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd"/>
          </svg>
          Search…
        </div>

       
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500">
            <path fillRule="evenodd" d="M4 8a6 6 0 1 1 12 0c0 1.887.454 3.665 1.257 5.234a.75.75 0 0 1-.515 1.076 32.91 32.91 0 0 1-3.256.508 3.5 3.5 0 0 1-6.972 0 32.903 32.903 0 0 1-3.256-.508.75.75 0 0 1-.515-1.076A11.448 11.448 0 0 0 4 8Zm6 7c-.655 0-1.305-.02-1.95-.057a2 2 0 0 0 3.9 0c-.645.038-1.295.057-1.95.057Z" clipRule="evenodd"/>
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        <button
          onClick={onNewInvoice}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all duration-150"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New Invoice
        </button>
      </div>
    </header>
  )
}