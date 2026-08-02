import {
  useEffect,
  useState,
} from 'react';
import { clientAPI, getToken, invoiceAPI, userAPI } from '../services/api';
import { AppContext } from './AppContextObject';

const readCache = (key) => {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

const writeCache = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures and fall back to in-memory state.
  }
};

const getScopedKey = (baseKey, userId) => {
  if (userId) {
    return `${baseKey}:${userId}`;
  }

  return baseKey;
};

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [authToken, setAuthToken] = useState(() => getToken());
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem('authUserId'));
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState(() => readCache(getScopedKey('invoiceData', localStorage.getItem('authUserId'))));
  const [clients, setClients] = useState(() => readCache(getScopedKey('clientData', localStorage.getItem('authUserId'))));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuthToken = () => {
      setAuthToken(getToken());
    };

    window.addEventListener('auth-changed', syncAuthToken);
    window.addEventListener('storage', syncAuthToken);

    return () => {
      window.removeEventListener('auth-changed', syncAuthToken);
      window.removeEventListener('storage', syncAuthToken);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!authToken) {
        setUser(null);
        setCurrentUserId(null);
        setInvoices([]);
        setClients([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setUser(null);

      const [invoicesResult, clientsResult, userResult] = await Promise.allSettled([
        invoiceAPI.getAll(),
        clientAPI.getAll(),
        userAPI.getProfile(),
      ]);

      const storedUserId = localStorage.getItem('authUserId');
      const fetchedUserId = userResult.status === 'fulfilled' && userResult.value?.data?._id
        ? userResult.value.data._id
        : storedUserId;

      if (fetchedUserId) {
        setCurrentUserId(fetchedUserId);
        localStorage.setItem('authUserId', fetchedUserId);
      }

      if (invoicesResult.status === 'fulfilled') {
        const nextInvoices = invoicesResult.value?.data || [];
        setInvoices(nextInvoices);
        writeCache(getScopedKey('invoiceData', fetchedUserId), nextInvoices);
      }

      if (clientsResult.status === 'fulfilled') {
        const nextClients = clientsResult.value?.data || [];
        setClients(nextClients);
        writeCache(getScopedKey('clientData', fetchedUserId), nextClients);
      }

      if (userResult.status === 'fulfilled' && userResult.value?.data) {
        setUser(userResult.value.data);
      }

      setLoading(false);
    };

    fetchData().catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, [authToken]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
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
    setInvoices((prev) => {
      const next = [response.data, ...prev];
      writeCache(getScopedKey('invoiceData', currentUserId), next);
      return next;
    });
  };

  const deleteInvoice = async (id) => {
    await invoiceAPI.delete(id);
    setInvoices((prev) => {
      const next = prev.filter((inv) => inv._id !== id);
      writeCache(getScopedKey('invoiceData', currentUserId), next);
      return next;
    });
  };

  const updateInvoice = async (id, data) => {
    const response = await invoiceAPI.update(id, data);
    setInvoices((prev) => {
      const next = prev.map((inv) => (inv._id === id ? response.data : inv));
      writeCache(getScopedKey('invoiceData', currentUserId), next);
      return next;
    });
  };

  const addClient = async (client) => {
    const response = await clientAPI.create(client);
    setClients((prev) => {
      const next = [response.data, ...prev];
      writeCache(getScopedKey('clientData', currentUserId), next);
      return next;
    });
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

        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

