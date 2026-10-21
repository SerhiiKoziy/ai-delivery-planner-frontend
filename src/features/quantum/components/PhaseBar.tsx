import { PHASES, phaseValue } from '../constants';
import type { QuantumRun } from '../types';
import { formatMs } from '../utils/format';

/** Stacked bar of how a run's wall time splits across phases. */
export function PhaseBar({ run, className = '' }: { run: QuantumRun; className?: string }) {
  const total = PHASES.reduce((sum, p) => sum + phaseValue(run, p.key), 0);
  if (!total) return null;
  return (
    <div className={`flex h-1.5 w-full overflow-hidden rounded-full bg-panel ${className}`}>
      {PHASES.map((p) => {
        const value = phaseValue(run, p.key);
        if (!value) return null;
        return (
          <span
            key={p.key}
            title={`${p.label}: ${formatMs(value)}`}
            style={{ width: `${(value / total) * 100}%`, background: p.color }}
          />
        );
      })}
    </div>
  );
}

export function PhaseLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
      {PHASES.map((p) => (
        <span key={p.key} className="flex items-center gap-1.5">
          <i className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
          {p.label}
        </span>
      ))}
    </div>
  );
}
