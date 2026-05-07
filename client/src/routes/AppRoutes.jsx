import { Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from '../services/api';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import InvoicePages from '../pages/InvoicePages';
import ClientPage from '../pages/ClientPage';
import PaymentPage from '../pages/PaymentPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import SettingPage from '../pages/SettingPage';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes({ isAuthenticated }) {
  const token = getToken();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/invoices" element={<ProtectedRoute><InvoicePages /></ProtectedRoute>} />
      <Route path="/invoices/create" element={<ProtectedRoute><InvoicePages /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><ClientPage /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
