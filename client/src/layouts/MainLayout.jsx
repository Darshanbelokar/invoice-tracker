import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar  from '../components/Topbar'

const PAGE_TITLES = {
  '/':         'Dashboard',
  '/invoices': 'Invoices',
  '/clients':  'Clients',
  '/payments': 'Payments',
}

export default function MainLayout({ onNewInvoice }) {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] ?? 'Invoicely'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <Sidebar />

      
      <div className="flex flex-col flex-1 overflow-hidden">
       
       <Topbar title={title} onNewInvoice={onNewInvoice} />

       
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}