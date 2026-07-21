import type { Route, RouteStop } from '../types';

function stopLocation(stop: RouteStop): string | null {
  if (stop.latitude != null && stop.longitude != null) {
    return `${stop.latitude},${stop.longitude}`;
  }
  return stop.address ?? null;
}

// Origin is intentionally omitted: Google Maps falls back to the device's
// current location, which is what "start navigating" should do.
export function buildGoogleMapsUrl(route: Route): string | null {
  const sorted = [...route.stops].sort((a, b) => a.sequence - b.sequence);
  const locations = sorted.map(stopLocation).filter((loc): loc is string => loc !== null);
  if (locations.length === 0) return null;

  const destination = locations[locations.length - 1];
  const waypoints = locations.slice(0, -1);

  const params = new URLSearchParams({
    api: '1',
    destination,
    travelmode: 'driving',
  });
  if (waypoints.length > 0) {
    params.set('waypoints', waypoints.join('|'));
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

// Origin is intentionally omitted here too, for the same reason as above.
export function buildGoogleMapsStopUrl(stop: RouteStop): string | null {
  const destination = stopLocation(stop);
  if (destination === null) return null;

  const params = new URLSearchParams({
    api: '1',
    destination,
    travelmode: 'driving',
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
