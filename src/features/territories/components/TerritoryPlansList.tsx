import { useNavigate } from 'react-router-dom';

import { formatDate } from '../../../utils/formatDate';
import { StatusBadge, formatMs, formatNum } from '../../quantum';
import { useTerritoryPlans } from '../api/useTerritoryPlans';
import { SOLVER_LABELS } from '../constants';

const HEADERS = ['Created', 'Solver', 'Status', 'Zones', 'Deliveries', 'Quantum steps', 'Imbalance', 'Time', ''];

export function TerritoryPlansList() {
  const { data: plans = [], isLoading, isError } = useTerritoryPlans();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-ink-muted">
        <div className="w-5 h-5 border-2 border-edge border-t-primary rounded-full animate-spin" />
        <span>Loading territory plans…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-danger">
        Failed to load territory plans.
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
        <span className="text-5xl mb-2">🧭</span>
        <p className="font-semibold text-ink">No territory plans yet</p>
        <p className="text-sm text-ink-muted">Calculate zones above to split deliveries between vehicles</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-edge">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {HEADERS.map((h) => (
              <th
                key={h}
                className="bg-panel text-ink-muted font-medium text-xs uppercase tracking-wider px-4 py-2.5 text-left border-b border-edge whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => {
            const m = plan.metrics ?? {};
            return (
              <tr
                key={plan.id}
                className="border-b border-edge last:border-b-0 hover:bg-card-hover transition-colors cursor-pointer"
                onClick={() => navigate(`/territories/${plan.id}`)}
              >
                <td className="px-4 py-3 text-ink-muted whitespace-nowrap">{formatDate(plan.created_at)}</td>
                <td className="px-4 py-3 text-ink">{SOLVER_LABELS[plan.solver] ?? plan.solver}</td>
                <td className="px-4 py-3"><StatusBadge status={plan.status} /></td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted">{plan.num_zones}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted">{plan.num_deliveries}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                  {m.quantum_runs == null ? '—' : `${m.quantum_steps_used ?? 0} / ${m.quantum_runs}`}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted">{formatNum(m.imbalance, 2)}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted">{formatMs(plan.total_ms)}</td>
                <td className="px-4 py-3 text-right text-ink-muted">→</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
