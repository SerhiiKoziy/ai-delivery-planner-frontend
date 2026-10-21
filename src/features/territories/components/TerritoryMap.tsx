import { useEffect, useRef, useState } from 'react';

import type { Delivery } from '../../deliveries';
import { zoneColor } from '../constants';
import type { TerritoryZone } from '../types';

interface Props {
  zones: TerritoryZone[];
  deliveries: Delivery[];
}

const SCRIPT_ID = 'google-maps-script';

function loadGoogleMaps(apiKey: string, onReady: () => void) {
  if (window.google?.maps) {
    onReady();
    return;
  }
  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    existing.addEventListener('load', onReady, { once: true });
    return;
  }
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
  script.async = true;
  script.onload = onReady;
  document.head.appendChild(script);
}

/** Deliveries coloured by zone, with each zone's centroid and radius drawn as a circle. */
export function TerritoryMap({ zones, deliveries }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const overlaysRef = useRef<(google.maps.Marker | google.maps.Circle)[]>([]);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;
    loadGoogleMaps(apiKey, () => {
      if (!mapRef.current) return;
      mapInstance.current = new window.google!.maps.Map(mapRef.current, {
        zoom: 11,
        center: { lat: 50.45, lng: 30.52 },
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#112016' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#9fb8a8' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1712' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1c3323' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#06150c' }] },
        ],
      });
      setMapReady(true);
    });
  }, [apiKey]);

  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;
    const map = mapInstance.current;
    const google = window.google!;

    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    const byId = new Map(deliveries.map((d) => [d.id, d]));
    const bounds = new google.maps.LatLngBounds();

    zones.forEach((zone) => {
      const color = zoneColor(zone.index);
      zone.delivery_ids.forEach((id) => {
        const d = byId.get(id);
        if (d?.latitude == null || d.longitude == null) return;
        const position = { lat: d.latitude, lng: d.longitude };
        bounds.extend(position);
        overlaysRef.current.push(
          new google.maps.Marker({
            position,
            map,
            title: `Zone ${zone.index + 1} — ${d.customer_name}`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: '#0b1712',
              strokeWeight: 1.5,
            },
          }),
        );
      });
      if (zone.centroid_lat != null && zone.centroid_lng != null) {
        overlaysRef.current.push(
          new google.maps.Circle({
            map,
            center: { lat: zone.centroid_lat, lng: zone.centroid_lng },
            radius: Math.max(zone.radius_km, 0.05) * 1000,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 1.5,
            fillColor: color,
            fillOpacity: 0.08,
            clickable: false,
          }),
        );
      }
    });

    if (!bounds.isEmpty()) map.fitBounds(bounds);
  }, [zones, deliveries, mapReady]);

  if (!apiKey) {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-2 bg-card text-center p-8">
        <span className="text-5xl mb-2">🗺️</span>
        <p className="text-sm text-ink-muted">
          Add <code className="bg-panel border border-edge rounded px-1 py-0.5 text-xs font-mono">VITE_GOOGLE_MAPS_API_KEY</code>{' '}
          to <code className="bg-panel border border-edge rounded px-1 py-0.5 text-xs font-mono">.env</code>{' '}
          to see zones on the map
        </p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full min-h-[460px]" />;
}
