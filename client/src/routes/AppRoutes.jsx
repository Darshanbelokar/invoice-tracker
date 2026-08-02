import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import InvoicePages from '../pages/InvoicePages';
import ClientPage from '../pages/ClientPage';
import PaymentPage from '../pages/PaymentPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import SettingPage from '../pages/SettingPage';

// Protected Route Wrapper driven by state
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Public Route Wrapper (redirects logged-in users away from /login)
function PublicRoute({ isAuthenticated, children }) {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function AppRoutes({ isAuthenticated }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Default Landing */}
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/invoices" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <InvoicePages />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/invoices/create" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <InvoicePages />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/clients" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ClientPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payments" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PaymentPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AnalyticsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SettingPage />
          </ProtectedRoute>
        } 
      />

      {/* Fallback Catch-All */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
}