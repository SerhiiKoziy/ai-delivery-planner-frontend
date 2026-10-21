import type { SolverAvailability } from '../types';

export function SolverChips({ solvers }: { solvers: Record<string, SolverAvailability> }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(solvers).map(([name, s]) => (
        <span
          key={name}
          title={s.reason ?? 'available'}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
            s.available
              ? 'border-primary text-primary-light bg-primary-muted'
              : 'border-edge text-ink-muted'
          }`}
        >
          {s.available ? '●' : '○'} {name}
        </span>
      ))}
    </div>
  );
}
