import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RoutesList } from '../features/routes';

const inputCls =
  'bg-panel border border-edge rounded-lg px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary transition-colors';

export function RoutesPage() {
  const [routeId, setRouteId] = useState('');
  const navigate = useNavigate();

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (routeId.trim()) navigate(`/routes/${routeId.trim()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-ink m-0">Routes</h1>
        <form className="flex gap-2" onSubmit={handleLoad}>
          <input
            className={`${inputCls} w-72`}
            placeholder="Enter Route ID…"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
          />
          <button className="btn btn--secondary" type="submit">
            Load
          </button>
        </form>
      </div>

      <RoutesList />
    </div>
  );
}
