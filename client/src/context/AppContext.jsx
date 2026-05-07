import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import {
  invoices as mockInvoices,
  clients as mockClients
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [invoices, setInvoices] = useState(mockInvoices);
  const [clients, setClients] = useState(mockClients);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDark = () => {
    setIsDark(prev => !prev);
  };

  // Invoice actions
  const addInvoice = (invoice) => {
    setInvoices(prev => [
      {
        ...invoice,
        id: `INV-00${prev.length + 1}`
      },
      ...prev
    ]);
  };

  const deleteInvoice = (id) => {
    setInvoices(prev =>
      prev.filter(inv => inv.id !== id)
    );
  };

  const updateInvoice = (id, data) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === id
          ? { ...inv, ...data }
          : inv
      )
    );
  };

  // Client actions
  const addClient = (client) => {
    setClients(prev => [
      {
        ...client,
        id: `C00${prev.length + 1}`
      },
      ...prev
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        isDark,
        toggleDark,

        invoices,
        addInvoice,
        deleteInvoice,
        updateInvoice,

        clients,
        addClient,

        sidebarOpen,
        setSidebarOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);