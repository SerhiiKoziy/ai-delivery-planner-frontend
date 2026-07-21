import type { Route, RouteStop } from '../types';
import { buildGoogleMapsStopUrl } from '../utils/googleMapsUrl';

interface Props {
  route: Route;
}

function fmtTime(t: string) {
  return t.slice(0, 5);
}

function StopItem({ stop, index, isLast }: { stop: RouteStop; index: number; isLast: boolean }) {
  const name = stop.customer_name ?? `Stop ${stop.sequence}`;
  const mapsUrl = buildGoogleMapsStopUrl(stop);
  return (
    <div className="flex gap-3">
      {/* Connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-[26px] h-[26px] rounded-full bg-primary-muted border-2 border-primary text-primary text-[0.7rem] font-bold flex items-center justify-center">
          {index + 1}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-edge my-1 min-h-[20px]" />}
      </div>

      {/* Content */}
      <div className="pb-5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-mono text-xs font-semibold text-primary">
              {fmtTime(stop.estimated_arrival)}
            </div>
            <div className="text-base font-semibold text-ink mt-0.5">{name}</div>
          </div>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in Google Maps"
              aria-label="Open in Google Maps"
              className="text-lg leading-none text-ink-muted hover:text-ink flex-shrink-0"
            >
              <span aria-hidden="true">🧭</span>
            </a>
          )}
        </div>
        {stop.address && <div className="text-xs text-ink-muted mt-0.5">{stop.address}</div>}
        {stop.distance_from_previous_km > 0 && (
          <div className="text-xs text-ink-muted mt-0.5">
            {stop.distance_from_previous_km.toFixed(1)} km from previous
          </div>
        )}
      </div>
    </div>
  );
}

export function RouteTimeline({ route }: Props) {
  const sorted = [...route.stops].sort((a, b) => a.sequence - b.sequence);

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Stats */}
      <div className="flex gap-4 flex-wrap pb-3 border-b border-edge">
        <div>
          <div className="text-[0.65rem] uppercase tracking-wider text-ink-muted">Distance</div>
          <div className="font-semibold text-ink">{route.total_distance_km.toFixed(1)} km</div>
        </div>
        <div>
          <div className="text-[0.65rem] uppercase tracking-wider text-ink-muted">Duration</div>
          <div className="font-semibold text-ink">
            {Math.floor(route.total_duration_minutes / 60)}h {route.total_duration_minutes % 60}m
          </div>
        </div>
        <div>
          <div className="text-[0.65rem] uppercase tracking-wider text-ink-muted">Stops</div>
          <div className="font-semibold text-ink">{sorted.length}</div>
        </div>
      </div>

      {/* Stops */}
      <div>
        {sorted.map((stop, i) => (
          <StopItem key={stop.id} stop={stop} index={i} isLast={i === sorted.length - 1} />
        ))}
      </div>
    </div>
  );
}
