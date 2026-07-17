import { Link, useLocation } from 'react-router-dom';

import { AppRouter } from './AppRouter';

const AUTH_ROUTES = ['/login', '/register'];

export function App() {
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

  if (isAuthRoute) {
    return <AppRouter />;
  }

  return (
    <div className="app-shell">
      <nav className="app-sidebar">
        <div className="app-sidebar__brand">AI Delivery Planner</div>
        <Link to="/">Dashboard</Link>
        <Link to="/deliveries">Deliveries</Link>
        <Link to="/drivers">Drivers</Link>
        <Link to="/routes">Routes</Link>
        <Link to="/login">Login</Link>
      </nav>
      <main className="app-content">
        <AppRouter />
      </main>
    </div>
  );
}
