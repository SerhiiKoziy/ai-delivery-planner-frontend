import { PHASES } from '../constants';
import type { TimingStats } from '../types';
import { formatMs } from '../utils/format';

const th =
  'bg-panel text-ink-muted font-medium text-xs uppercase tracking-wider px-4 py-2.5 text-left border-b border-edge whitespace-nowrap';
const td = 'px-4 py-2.5 font-mono text-xs text-ink-muted text-right';

const EMPTY: TimingStats = { count: 0, avg_ms: null, p50_ms: null, p95_ms: null, max_ms: null };

export function PhaseTimingsTable({ timings }: { timings: Record<string, TimingStats> }) {
  const avgTotal = PHASES.reduce((sum, p) => sum + (timings[p.key]?.avg_ms ?? 0), 0);
  const rows = [...PHASES, { key: 'total_ms', label: 'Whole step', color: '' }];

  return (
    <div className="overflow-x-auto rounded-lg border border-edge">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className={th}>Phase</th>
            {['N', 'Avg', 'p50', 'p95', 'Max'].map((h) => (
              <th key={h} className={`${th} text-right`}>{h}</th>
            ))}
            <th className={th}>Share of avg step</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const t = timings[p.key] ?? EMPTY;
            const isTotal = p.key === 'total_ms';
            return (
              <tr key={p.key} className="border-b border-edge last:border-b-0">
                <td className={`px-4 py-2.5 text-ink ${isTotal ? 'font-semibold' : ''}`}>{p.label}</td>
                <td className={td}>{t.count}</td>
                <td className={td}>{formatMs(t.avg_ms)}</td>
                <td className={td}>{formatMs(t.p50_ms)}</td>
                <td className={td}>{formatMs(t.p95_ms)}</td>
                <td className={td}>{formatMs(t.max_ms)}</td>
                <td className="px-4 py-2.5">
                  {!isTotal && avgTotal > 0 && (
                    <div className="w-48 h-1.5 rounded-full bg-panel overflow-hidden">
                      <span
                        className="block h-full"
                        style={{ width: `${((t.avg_ms ?? 0) / avgTotal) * 100}%`, background: p.color }}
                      />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
