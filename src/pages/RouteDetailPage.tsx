import { Link, useParams } from 'react-router-dom';

import { ChatPanel } from '../features/chat';
import { ReplanPanel } from '../features/replanning';
import { useRoute } from '../features/routes/api/useRoute';
import { RouteMap } from '../features/routes/components/RouteMap';
import { RouteTimeline } from '../features/routes/components/RouteTimeline';

export function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: route, isLoading, isError } = useRoute(id ?? null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link to="/routes" className="text-sm text-primary hover:underline">
            ← Back to Routes
          </Link>
          <h1 className="text-2xl font-bold text-ink m-0 mt-1">Route {id}</h1>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-16 text-ink-muted">
          <div className="w-5 h-5 border-2 border-edge border-t-primary rounded-full animate-spin" />
          <span>Loading route…</span>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center py-12 text-sm text-danger">
          Route not found or failed to load.
        </div>
      )}

      {route && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px_340px] gap-5 min-h-[560px]">
          <div className="rounded-lg overflow-hidden border border-edge">
            <RouteMap route={route} />
          </div>
          <div className="border border-edge rounded-lg overflow-y-auto">
            <RouteTimeline route={route} />
          </div>
          <div className="border border-edge rounded-lg overflow-hidden">
            <ChatPanel routeId={route.id} />
          </div>
        </div>
      )}

      {route && <ReplanPanel routeId={route.id} />}
    </div>
  );
}
