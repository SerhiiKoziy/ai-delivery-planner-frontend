import { formatNum } from '../../quantum';
import { zoneColor } from '../constants';
import type { TerritoryBalanceBy, TerritoryZone } from '../types';

const th =
  'bg-panel text-ink-muted font-medium text-xs uppercase tracking-wider px-4 py-2.5 text-left border-b border-edge whitespace-nowrap';
const td = 'px-4 py-3 font-mono text-xs text-ink-muted';

export function TerritoryZonesTable({
  zones,
  balanceBy,
}: {
  zones: TerritoryZone[];
  balanceBy: TerritoryBalanceBy;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-edge">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className={th}>Zone</th>
            <th className={th}>Vehicle</th>
            <th className={th}>Stops</th>
            <th className={th}>Load ({balanceBy === 'weight' ? 'kg' : 'stops'})</th>
            <th className={th}>Radius</th>
            <th className={th}>Centre</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((z) => (
            <tr key={z.index} className="border-b border-edge last:border-b-0">
              <td className="px-4 py-3 text-ink">
                <span className="inline-flex items-center gap-2">
                  <i className="inline-block w-3 h-3 rounded-full" style={{ background: zoneColor(z.index) }} />
                  {z.index + 1}
                </span>
              </td>
              <td className="px-4 py-3 text-ink">{z.plate_number ?? z.vehicle_id.slice(0, 8)}</td>
              <td className={td}>{z.stop_count}</td>
              <td className={td}>{formatNum(z.load, 1)}</td>
              <td className={td}>{formatNum(z.radius_km, 2)} km</td>
              <td className={td}>
                {z.centroid_lat == null || z.centroid_lng == null
                  ? '—'
                  : `${z.centroid_lat.toFixed(4)}, ${z.centroid_lng.toFixed(4)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
