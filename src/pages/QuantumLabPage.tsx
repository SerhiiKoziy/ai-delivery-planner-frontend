import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
  PhaseLegend,
  PhaseTimingsTable,
  QUANTUM_REFETCH_MS,
  QuantumKpis,
  QuantumRunDetailPanel,
  QuantumRunsTable,
  SolverChips,
  useQuantumRuns,
  useQuantumSummary,
} from '../features/quantum';

export function QuantumLabPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const planFilter = searchParams.get('plan');
  const selectedRunId = searchParams.get('run');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const refetchInterval = autoRefresh ? QUANTUM_REFETCH_MS : false;

  const summary = useQuantumSummary({ refetchInterval });
  const runs = useQuantumRuns({ territoryPlanId: planFilter, refetchInterval });

  const updateParams = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink m-0">Quantum lab</h1>
          <p className="text-sm text-ink-muted m-0 mt-1 max-w-3xl">
            Every territory recalculation splits deliveries by recursive bisection. Each step sent
            to a quantum backend is logged here: when, where, how long each phase took and how
            good the QAOA answer was compared with the exact classical optimum.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            style={{ width: 'auto' }}
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Auto-refresh
        </label>
      </div>

      {summary.isLoading && <div className="h-[200px] rounded-lg border border-edge bg-card animate-skeleton" />}
      {summary.isError && <p className="form-error">Could not load quantum summary.</p>}
      {summary.data && (
        <>
          <SolverChips solvers={summary.data.solvers} />
          <QuantumKpis summary={summary.data} />

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-ink m-0">Time by phase</h2>
            <PhaseLegend />
            <PhaseTimingsTable timings={summary.data.timings} />
          </div>
        </>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-lg font-semibold text-ink m-0">Quantum backend runs</h2>
          <p className="text-sm text-ink-muted m-0">
            {planFilter ? (
              <>
                Runs of plan{' '}
                <Link to={`/territories/${planFilter}`} className="text-primary hover:underline font-mono">
                  {planFilter.slice(0, 8)}
                </Link>{' '}
                ·{' '}
                <button
                  type="button"
                  className="text-primary hover:underline bg-transparent border-0 p-0 cursor-pointer"
                  onClick={() => updateParams({ plan: null, run: null })}
                >
                  show all
                </button>
              </>
            ) : (
              'Click a row for the full request and response.'
            )}
          </p>
        </div>

        {runs.isLoading && <div className="h-[200px] rounded-lg border border-edge bg-card animate-skeleton" />}
        {runs.isError && <p className="form-error">Could not load quantum runs.</p>}
        {runs.data && (
          <QuantumRunsTable
            runs={runs.data}
            selectedId={selectedRunId}
            onSelect={(id) => updateParams({ run: id })}
          />
        )}
      </div>

      {selectedRunId && <QuantumRunDetailPanel runId={selectedRunId} />}
    </div>
  );
}
