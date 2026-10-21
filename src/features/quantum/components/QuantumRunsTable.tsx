import { formatDate } from '../../../utils/formatDate';
import type { QuantumRun } from '../types';
import { formatMs, formatNum, formatPct, liftOverRandom } from '../utils/format';
import { PhaseBar } from './PhaseBar';
import { StatusBadge } from './StatusBadge';

interface Props {
  runs: QuantumRun[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const HEADERS: { label: string; title?: string; num?: boolean }[] = [
  { label: 'When' },
  { label: 'Step' },
  { label: 'Backend' },
  { label: 'Status' },
  { label: 'n · p · shots', title: 'qubits · QAOA layers · shots', num: true },
  { label: 'Depth', title: 'logical → transpiled', num: true },
  { label: '2q gates', title: 'logical RZZ → physical two-qubit gates', num: true },
  { label: 'Queue', num: true },
  { label: 'Exec', num: true },
  { label: 'Total', num: true },
  { label: 'Approx', title: '1.0 = every shot optimal', num: true },
  { label: 'Optimum in shots', title: 'optimum frequency in shots / in random bitstrings', num: true },
  { label: 'Answer' },
];

function arrow(before: number | null, after: number | null): string {
  if (after != null) return `${before ?? '—'} → ${after}`;
  return before == null ? '—' : String(before);
}

export function QuantumRunsTable({ runs, selectedId, onSelect }: Props) {
  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
        <span className="text-4xl mb-1">⚛️</span>
        <p className="font-semibold text-ink">No quantum runs yet</p>
        <p className="text-sm text-ink-muted">
          Calculate territories with a quantum solver to see its runs here
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[480px] rounded-lg border border-edge">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0">
          <tr>
            {HEADERS.map((h) => (
              <th
                key={h.label}
                title={h.title}
                className={`bg-panel text-ink-muted font-medium text-xs uppercase tracking-wider px-3 py-2.5 border-b border-edge whitespace-nowrap ${
                  h.num ? 'text-right' : 'text-left'
                }`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => {
            const lift = liftOverRandom(r);
            return (
              <tr
                key={r.id}
                onClick={() => onSelect(r.id)}
                className={`border-b border-edge last:border-b-0 cursor-pointer transition-colors ${
                  selectedId === r.id ? 'bg-primary-muted' : 'hover:bg-card-hover'
                }`}
              >
                <td className="px-3 py-2.5 text-ink-muted whitespace-nowrap">{formatDate(r.created_at)}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink">{r.step}</td>
                <td className="px-3 py-2.5 text-ink">
                  {r.backend_name || r.provider}
                  <div className="text-xs text-ink-muted">{r.provider}</div>
                </td>
                <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-muted text-right whitespace-nowrap">
                  {r.num_qubits} · {r.qaoa_reps} · {r.shots}
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-muted text-right whitespace-nowrap">
                  {arrow(r.logical_depth, r.transpiled_depth)}
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-muted text-right whitespace-nowrap">
                  {arrow(r.two_qubit_gates, r.transpiled_two_qubit_gates)}
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-muted text-right">{formatMs(r.queue_ms)}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-muted text-right">{formatMs(r.execution_ms)}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-muted text-right min-w-[90px]">
                  {formatMs(r.total_ms)}
                  <PhaseBar run={r} className="mt-1" />
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-muted text-right">
                  {formatNum(r.approximation_ratio)}
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-muted text-right whitespace-nowrap">
                  {formatPct(r.sampled_optimum_frequency, 2)}
                  <div className="text-ink-muted/80">
                    {lift == null
                      ? `random ${formatPct(r.uniform_optimum_probability, 2)}`
                      : `×${lift.toFixed(1)} vs random`}
                  </div>
                </td>
                <td
                  className={`px-3 py-2.5 text-xs font-semibold ${
                    r.chosen_source === 'quantum' ? 'text-primary-light' : 'text-ink-muted'
                  }`}
                >
                  {r.chosen_source ?? '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
