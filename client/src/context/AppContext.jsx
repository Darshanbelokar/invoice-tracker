import { createContext, useContext, useState, useCallback } from 'react'
import { INVOICES } from '../data/mockData'

/**
 * AppContext
 *
 * Provides global app state (user, invoices, modal) to the whole tree.
 * Wrap your root in <AppProvider> and consume with useAppContext().
 */
export const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Simulated auth — replace with real auth hook/service
  const [user] = useState({ name: 'Aarav Kumar', role: 'Admin', initials: 'AK' })

  // Invoice state (used by Dashboard + Invoices pages)
  const [invoices, setInvoices] = useState(INVOICES)

  const addInvoice = useCallback((invoice) => {
    setInvoices((prev) => [invoice, ...prev])
  }, [])

  const removeInvoice = useCallback((id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
  }, [])

  // New Invoice modal visibility
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const openInvoiceModal  = useCallback(() => setInvoiceModalOpen(true),  [])
  const closeInvoiceModal = useCallback(() => setInvoiceModalOpen(false), [])

  const value = {
    user,
    invoices,
    addInvoice,
    removeInvoice,
    invoiceModalOpen,
    openInvoiceModal,
    closeInvoiceModal,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}