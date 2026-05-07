import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';
import { invoiceAPI, clientAPI } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch invoices and clients from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [invoicesRes, clientsRes] = await Promise.all([
          invoiceAPI.getAll(),
          clientAPI.getAll()
        ]);
        
        setInvoices(invoicesRes.data || []);
        setClients(clientsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setInvoices([]);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
  const addInvoice = async (invoice) => {
    try {
      const response = await invoiceAPI.create(invoice);
      const newInvoice = response.data;
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await invoiceAPI.delete(id);
      setInvoices(prev => prev.filter(inv => inv._id !== id));
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      throw error;
    }
  };

  const updateInvoice = async (id, data) => {
    try {
      const response = await invoiceAPI.update(id, data);
      const updatedInvoice = response.data;
      setInvoices(prev =>
        prev.map(inv =>
          inv._id === id ? updatedInvoice : inv
        )
      );
      return updatedInvoice;
    } catch (error) {
      console.error('Failed to update invoice:', error);
      throw error;
    }
  };

  // Client actions
  const addClient = async (client) => {
    try {
      const response = await clientAPI.create(client);
      const newClient = response.data;
      setClients(prev => [newClient, ...prev]);
      return newClient;
    } catch (error) {
      console.error('Failed to create client:', error);
      throw error;
    }
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
        setSidebarOpen,
        
        loading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);