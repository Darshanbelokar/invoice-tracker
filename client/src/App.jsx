import { Routes, Route } from 'react-router-dom'
import { useAppContext } from './context/useAppContext'

import MainLayout      from './layouts/MainLayout'
import AuthLayout      from './layouts/AuthLayout'
import NewInvoiceModal from './components/NewInvoiceModal'

import Dashboard from './pages/Dashboard'
import Invoices  from './pages/Invoices'
import Clients   from './pages/Clients'
import Payments  from './pages/Payments'

export default function App() {
  const { invoiceModalOpen, openInvoiceModal, closeInvoiceModal, addInvoice } = useAppContext()

  return (
    <>
      <Routes>
        {/* Authenticated shell */}
        <Route element={<MainLayout onNewInvoice={openInvoiceModal} />}>
          <Route index            element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />}  />
          <Route path="/clients"  element={<Clients />}   />
          <Route path="/payments" element={<Payments />}  />
        </Route>

        {/* Auth pages (no sidebar) — add Login/Register pages here later */}
        <Route element={<AuthLayout />}>
          {/* <Route path="/login"    element={<Login />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
        </Route>
      </Routes>

      <NewInvoiceModal
        open={invoiceModalOpen}
        onClose={closeInvoiceModal}
        onSave={(invoice) => {
          addInvoice(invoice)
          closeInvoiceModal()
        }}
      />
    </>
  )
}