import { NavLink, useLocation } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { AppRouter } from './AppRouter';

// Routes rendered without the authenticated app shell (sidebar), regardless
// of auth state — /verify-email must stay shell-less even after it flips
// isAuthenticated to true mid-page, or AppRouter remounts into the sidebar
// branch and the verification result flashes back to a loading state.
const AUTH_ROUTES = ['/login', '/register', '/verify-email'];

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/deliveries', label: 'Deliveries', end: false },
  { to: '/drivers', label: 'Drivers', end: false },
  { to: '/depots', label: 'Depots', end: false },
  { to: '/vehicles', label: 'Vehicles', end: false },
  { to: '/routes', label: 'Routes', end: false },
  { to: '/territories', label: 'Territories', end: false },
  { to: '/quantum', label: 'Quantum lab', end: false },
];

export function App() {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

  if (isAuthRoute || !isAuthenticated) {
    return <AppRouter />;
  }

  return (
    <div className="app-shell">
      <nav className="w-[220px] flex-shrink-0 bg-panel border-r border-edge flex flex-col px-4 py-6 min-h-screen">
        <div className="text-ink font-semibold text-[1.05rem] mb-5 flex items-center gap-2">
          <span>🚚</span>
          AI Delivery Planner
        </div>

        <div className="flex flex-col gap-0.5 flex-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-[0.95rem] no-underline transition-colors ${
                  isActive
                    ? 'bg-primary-muted text-primary font-medium'
                    : 'text-ink-muted hover:bg-card-hover hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          className="mt-auto text-left px-3 py-2 rounded-lg text-sm text-ink-muted border border-edge hover:bg-danger-muted hover:text-danger hover:border-danger transition-colors cursor-pointer bg-transparent"
          onClick={logout}
        >
          Log out
        </button>
      </nav>

      <main className="app-content">
        <AppRouter />
      </main>
    </div>
  );
}
