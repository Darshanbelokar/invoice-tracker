import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';
import { invoiceAPI, clientAPI, userAPI, getToken } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const promises = [invoiceAPI.getAll(), clientAPI.getAll()];
        if (getToken()) promises.push(userAPI.getProfile());

        const [invoicesRes, clientsRes, userRes] = await Promise.all(promises);

        setInvoices(invoicesRes?.data || []);
        setClients(clientsRes?.data || []);
        if (userRes && userRes.data) setUser(userRes.data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const refreshUser = async () => {
    try {
      const res = await userAPI.getProfile();
      if (res && res.data) setUser(res.data);
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  const addInvoice = async (invoice) => {
    const response = await invoiceAPI.create(invoice);
    setInvoices(prev => [response.data, ...prev]);
  };

  const deleteInvoice = async (id) => {
    await invoiceAPI.delete(id);
    setInvoices(prev => prev.filter(inv => inv._id !== id));
  };

  const updateInvoice = async (id, data) => {
    const response = await invoiceAPI.update(id, data);

    setInvoices(prev =>
      prev.map(inv =>
        inv._id === id ? response.data : inv
      )
    );
  };

  const addClient = async (client) => {
    const response = await clientAPI.create(client);
    setClients(prev => [response.data, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        isDark,
        toggleDark,

        user,
        setUser,
        refreshUser,

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