import { formatDate } from '../../../utils/formatDate';
import type { QuantumSummary } from '../types';
import { formatNum, formatPct } from '../utils/format';

function joinCounts(counts: Record<string, number>): string {
  return Object.entries(counts)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' · ');
}

function Kpi({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="bg-card border border-edge rounded-lg p-4 shadow-card">
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="text-xl font-bold text-ink mt-1">{value}</div>
      {hint && <div className="text-xs text-ink-muted/80 mt-1">{hint}</div>}
    </div>
  );
}

export function QuantumKpis({ summary: s }: { summary: QuantumSummary }) {
  const completed = s.runs_by_status.completed ?? 0;
  const budgetUsed = s.qpu_monthly_budget_seconds
    ? s.qpu_seconds_this_month / s.qpu_monthly_budget_seconds
    : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <Kpi
        label="Quantum backend calls"
        value={s.total_runs}
        hint={joinCounts(s.runs_by_provider) || 'none yet'}
      />
      <Kpi
        label="Succeeded"
        value={s.total_runs ? formatPct(completed / s.total_runs) : '—'}
        hint={joinCounts(s.runs_by_status)}
      />
      <Kpi
        label="Lift over random"
        value={s.avg_lift_over_random == null ? '—' : `×${formatNum(s.avg_lift_over_random, 1)}`}
        hint="Optimum frequency in shots vs random bitstrings (×1 = no benefit)"
      />
      <Kpi
        label="Quantum found optimum"
        value={formatPct(s.quantum_matched_optimum_rate)}
        hint={`Random shots would hit it ${formatPct(s.avg_random_hit_probability, 0)} of the time`}
      />
      <Kpi
        label="Approximation ratio"
        value={formatNum(s.avg_approximation_ratio)}
        hint="1.0 = every shot optimal"
      />
      <Kpi
        label="P(optimum), ideal QAOA"
        value={formatPct(s.avg_optimum_probability, 2)}
        hint={`vs ${formatPct(s.avg_uniform_optimum_probability, 2)} random guessing`}
      />
      <Kpi
        label="Optimum frequency in shots"
        value={formatPct(s.avg_sampled_optimum_frequency, 2)}
        hint="Including backend noise"
      />
      <Kpi label="Total shots" value={s.total_shots.toLocaleString()} hint="In successful runs" />
      <Kpi
        label="QPU time this month"
        value={`${formatNum(s.qpu_seconds_this_month, 1)} s`}
        hint={`of ${formatNum(s.qpu_monthly_budget_seconds, 0)} s budget${
          budgetUsed == null ? '' : ` (${formatPct(budgetUsed, 0)})`
        }`}
      />
      <Kpi label="Last run" value={s.last_run_at ? formatDate(s.last_run_at) : '—'} />
    </div>
  );
}
