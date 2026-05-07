import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import InvoicePages from '../pages/InvoicePages';
import ClientPage from '../pages/ClientPage';
import PaymentPage from '../pages/PaymentPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import SettingPage from '../pages/SettingPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/invoices" element={<InvoicePages />} />
      <Route path="/invoices/create" element={<InvoicePages />} />
      <Route path="/clients" element={<ClientPage />} />
      <Route path="/payments" element={<PaymentPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/settings" element={<SettingPage />} />
    </Routes>
  );
}
