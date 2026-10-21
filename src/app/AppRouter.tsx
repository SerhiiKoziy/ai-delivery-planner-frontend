import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { DashboardPage } from '../pages/DashboardPage';
import { DeliveriesPage } from '../pages/DeliveriesPage';
import { DepotsPage } from '../pages/DepotsPage';
import { DriversPage } from '../pages/DriversPage';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { QuantumLabPage } from '../pages/QuantumLabPage';
import { RegisterPage } from '../pages/RegisterPage';
import { RouteDetailPage } from '../pages/RouteDetailPage';
import { RoutesPage } from '../pages/RoutesPage';
import { TerritoriesPage } from '../pages/TerritoriesPage';
import { TerritoryPlanDetailPage } from '../pages/TerritoryPlanDetailPage';
import { VehiclesPage } from '../pages/VehiclesPage';
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

// The root route has no auth gate: it shows the dashboard when logged in,
// and a public marketing landing page otherwise (instead of redirecting to
// /login like every other route).
function HomeRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <DashboardPage /> : <LandingPage />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/" element={<HomeRoute />} />
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
        path="/depots"
        element={
          <PrivateRoute>
            <DepotsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <PrivateRoute>
            <VehiclesPage />
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
      <Route
        path="/territories"
        element={
          <PrivateRoute>
            <TerritoriesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/territories/:id"
        element={
          <PrivateRoute>
            <TerritoryPlanDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/quantum"
        element={
          <PrivateRoute>
            <QuantumLabPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
