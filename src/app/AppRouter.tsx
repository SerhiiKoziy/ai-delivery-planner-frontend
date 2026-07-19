import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { DashboardPage } from '../pages/DashboardPage';
import { DeliveriesPage } from '../pages/DeliveriesPage';
import { DriversPage } from '../pages/DriversPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { RouteDetailPage } from '../pages/RouteDetailPage';
import { RoutesPage } from '../pages/RoutesPage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';
import { useAuthStore } from '../store/authStore';

export function PrivateRoute({ children }: { children: React.ReactElement }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/deliveries"
        element={
          <PrivateRoute>
            <DeliveriesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/drivers"
        element={
          <PrivateRoute>
            <DriversPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/routes"
        element={
          <PrivateRoute>
            <RoutesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/routes/:id"
        element={
          <PrivateRoute>
            <RouteDetailPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
