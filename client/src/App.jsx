import { Routes, Route, useNavigate } from 'react-router-dom'
import { useAppContext } from './context/useAppContext'

import MainLayout      from './layouts/MainLayout'
import NewInvoiceModal from './components/NewInvoiceModal'

import Dashboard from './pages/Dashboard'
import Invoices  from './pages/Invoices'
import Clients   from './pages/Clients'
import Payments  from './pages/Payments'
import Login     from './pages/Login'
import Register  from './pages/Register'

export default function App() {
  const navigate = useNavigate()
  const { invoiceModalOpen, openInvoiceModal, closeInvoiceModal, addInvoice } = useAppContext()

  const handleLogin = (user) => {
    console.log('Logged in:', user)
    navigate('/')
  }

  const handleRegister = () => {
    console.log('Account created, redirecting to login')
    navigate('/login')
  }

  const handleGoToRegister = () => {
    navigate('/register')
  }

  const handleGoToLogin = () => {
    navigate('/login')
  }

  return (
    <>
      <Routes>
        {/* Auth Pages */}
        <Route path="/login"    element={<Login onLogin={handleLogin} onGoRegister={handleGoToRegister} />} />
        <Route path="/register" element={<Register onNavigate={(page) => navigate(`/${page}`)} />} />

        {/* Authenticated shell */}
        <Route element={<MainLayout onNewInvoice={openInvoiceModal} />}>
          <Route index            element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />}  />
          <Route path="/clients"  element={<Clients />}   />
          <Route path="/payments" element={<Payments />}  />
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