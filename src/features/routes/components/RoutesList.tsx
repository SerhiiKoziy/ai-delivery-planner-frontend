import { useNavigate } from 'react-router-dom';

import { Badge } from '../../../components/shared';
import { useRoutes } from '../api/useRoutes';
import type { BadgeVariant } from '../../../components/shared';

const STATUS_LABELS: Record<string, string> = {
  planned: 'Planned',
  in_progress: 'In Progress',
  completed: 'Completed',
};

function statusVariant(status: string): BadgeVariant {
  return status in STATUS_LABELS ? (status as BadgeVariant) : 'default';
}

export function RoutesList() {
  const { data: routes = [], isLoading, isError } = useRoutes();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-ink-muted">
        <div className="w-5 h-5 border-2 border-edge border-t-primary rounded-full animate-spin" />
        <span>Loading routes…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-danger">
        Failed to load routes.
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
        <span className="text-5xl mb-2">🗺️</span>
        <p className="font-semibold text-ink">No routes yet</p>
        <p className="text-sm text-ink-muted">
          Generate a route from the Deliveries page to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-edge">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {['Status', 'Distance', 'Duration', 'Created', ''].map((h) => (
              <th
                key={h}
                className="bg-panel text-ink-muted font-medium text-xs uppercase tracking-wider px-4 py-2.5 text-left border-b border-edge whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr
              key={route.id}
              className="border-b border-edge last:border-b-0 hover:bg-card-hover transition-colors cursor-pointer"
              onClick={() => navigate(`/routes/${route.id}`)}
            >
              <td className="px-4 py-3">
                <Badge variant={statusVariant(route.status)}>
                  {STATUS_LABELS[route.status] ?? route.status}
                </Badge>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                {route.total_distance_km.toFixed(1)} km
              </td>
              <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                {route.total_duration_minutes} min
              </td>
              <td className="px-4 py-3 text-ink-muted whitespace-nowrap">
                {new Date(route.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right text-ink-muted">→</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
