import { Route, Routes } from 'react-router-dom';

import { DashboardPage } from '../pages/DashboardPage';
import { DeliveriesPage } from '../pages/DeliveriesPage';
import { DriversPage } from '../pages/DriversPage';
import { RoutesPage } from '../pages/RoutesPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/deliveries" element={<DeliveriesPage />} />
      <Route path="/drivers" element={<DriversPage />} />
      <Route path="/routes" element={<RoutesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
