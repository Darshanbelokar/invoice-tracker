import Button from '../components/Button'
import { CLIENTS } from '../data/mockData'
import { fmt } from '../utils/format'

export default function Clients() {
  function handleAction(label, name) {
    alert(`${label}: ${name}`)
  }

  return (
    <div className="p-8">
    

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLIENTS.map((client) => {
          const outstanding = client.total - client.paid

          return (
            <div
              key={client.id}
              className="card overflow-hidden hover:shadow-lg transition-all"
            >
            

              {/* Stats */}
              <div className="card-body py-4 border-b border-gray-200">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoices</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{client.invoices}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total billed</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{fmt(client.total)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Outstanding</p>
                    <p className={`text-lg font-bold mt-1 ${outstanding > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                      {fmt(outstanding)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card-body py-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 justify-center" 
                    onClick={() => handleAction('View client', client.name)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="flex-1 justify-center" 
                    onClick={() => handleAction('New invoice for', client.name)}
                  >
                    + Invoice
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {CLIENTS.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v10a6 6 0 006 6h6a6 6 0 006-6V9h-6a4 4 0 00-4-4z" />
          </svg>
          <p className="text-gray-500 font-medium">No clients yet</p>
          <p className="text-gray-400 text-sm mt-1">Start by adding your first client</p>
        </div>
      )}
    </div>
  )
}