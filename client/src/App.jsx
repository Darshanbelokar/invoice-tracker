import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { getToken } from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists
    const token = getToken();
    setIsAuthenticated(!!token);
    setLoading(false);

    // Listen for storage changes (from other tabs or same tab)
    const handleStorageChange = () => {
      const newToken = getToken();
      setIsAuthenticated(!!newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <AppRoutes isAuthenticated={isAuthenticated} />;
}