import { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { getToken } from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial token
    const token = getToken();
    setIsAuthenticated(!!token);
    setLoading(false);

    // Handles token changes across other browser tabs
    const handleStorageChange = () => {
      const newToken = getToken();
      setIsAuthenticated(!!newToken);
    };

    // Handles token changes in the SAME browser tab
    const handleAuthChange = () => {
      const newToken = getToken();
      setIsAuthenticated(!!newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <AppRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />;
}