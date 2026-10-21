import { Link, useParams } from 'react-router-dom';

import { useDeliveries } from '../features/deliveries';
import { StatusBadge, formatMs, formatNum } from '../features/quantum';
import {
  SOLVER_LABELS,
  TerritoryMap,
  TerritoryZonesTable,
  useTerritoryPlan,
} from '../features/territories';
import { formatDate } from '../utils/formatDate';

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-card border border-edge rounded-lg px-4 py-3">
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="text-lg font-semibold text-ink mt-0.5">{value}</div>
    </div>
  );
}

export function TerritoryPlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: plan, isLoading, isError } = useTerritoryPlan(id);
  const { data: deliveries = [] } = useDeliveries();

  const m = plan?.metrics ?? {};
  const skipped = m.skipped_not_geocoded ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link to="/territories" className="text-sm text-primary hover:underline">
            ← Back to Territories
          </Link>
          <h1 className="text-2xl font-bold text-ink m-0 mt-1 flex items-center gap-3">
            Territory plan
            {plan && <StatusBadge status={plan.status} />}
          </h1>
          {plan && (
            <p className="text-sm text-ink-muted m-0 mt-1">
              {SOLVER_LABELS[plan.solver] ?? plan.solver} · balanced by {plan.balance_by} ·{' '}
              {formatDate(plan.created_at)}
            </p>
          )}
        </div>
        {plan && plan.metrics.quantum_runs != null && plan.metrics.quantum_runs > 0 && (
          <Link to={`/quantum?plan=${plan.id}`} className="btn btn--secondary">
            ⚛️ Quantum runs of this plan →
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-16 text-ink-muted">
          <div className="w-5 h-5 border-2 border-edge border-t-primary rounded-full animate-spin" />
          <span>Loading territory plan…</span>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center py-12 text-sm text-danger">
          Territory plan not found or failed to load.
        </div>
      )}

      {plan && (
        <>
          {plan.error && <p className="form-error">{plan.error}</p>}

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <Metric label="Zones" value={plan.num_zones} />
            <Metric label="Deliveries" value={plan.num_deliveries} />
            <Metric label="Imbalance (1.0 = even)" value={formatNum(m.imbalance, 2)} />
            <Metric label="Max zone radius" value={`${formatNum(m.max_radius_km, 2)} km`} />
            <Metric
              label="Quantum answers used"
              value={m.quantum_runs == null ? '—' : `${m.quantum_steps_used ?? 0} / ${m.quantum_runs}`}
            />
            <Metric label="Calculation time" value={formatMs(plan.total_ms)} />
          </div>

          {skipped.length > 0 && (
            <p className="text-sm text-danger m-0">
              {skipped.length} deliver{skipped.length === 1 ? 'y was' : 'ies were'} skipped (address
              not geocoded).
            </p>
          )}

          {plan.zones.length > 0 && (
            <>
              <div className="rounded-lg overflow-hidden border border-edge">
                <TerritoryMap zones={plan.zones} deliveries={deliveries} />
              </div>
              <TerritoryZonesTable zones={plan.zones} balanceBy={plan.balance_by} />
              <p className="text-sm text-ink-muted m-0">
                To keep each delivery on its zone's vehicle, pick this plan under “Territory plan”
                when generating routes on the Deliveries page.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}
