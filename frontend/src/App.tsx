import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Main pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

// Module pages
import PassionSinglesPage from './pages/passion-singles/PassionSinglesPage';
import PassionConnectPage from './pages/passion-connect/PassionConnectPage';
import PassionCouplesPage from './pages/passion-couples/PassionCouplesPage';

// Admin
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Other pages
import PartnershipPage from './pages/PartnershipPage';
import NotFoundPage from './pages/NotFoundPage';

import Layout from './components/common/Layout';

function App() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#00b5fd',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f90371',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" />} />
        <Route path="/" element={<HomePage />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/passion-singles/*" element={<PassionSinglesPage />} />
          <Route path="/passion-connect/*" element={<PassionConnectPage />} />
          <Route path="/passion-couples/*" element={<PassionCouplesPage />} />
          <Route path="/partnership" element={<PartnershipPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;

