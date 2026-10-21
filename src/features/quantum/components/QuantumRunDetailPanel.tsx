import type { ReactNode } from 'react';

import { Card } from '../../../components/shared';
import { formatDate } from '../../../utils/formatDate';
import { useQuantumRun } from '../api/useQuantumRun';
import { PHASES, phaseValue } from '../constants';
import type { QuantumRunDetail } from '../types';
import { formatMs, formatNum, formatPct, liftOverRandom, randomHitProbability } from '../utils/format';
import { PhaseBar } from './PhaseBar';
import { StatusBadge } from './StatusBadge';

function KeyValues({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[minmax(140px,auto)_1fr] gap-x-4 gap-y-1.5 text-sm m-0">
      {rows.map(([k, v], i) => (
        <div key={i} className="contents">
          <dt className="text-ink-muted">{k}</dt>
          <dd className="text-ink m-0 break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono text-xs bg-panel border border-edge rounded px-1 py-0.5">{children}</code>;
}

const joinFixed = (values?: number[]) => (values ?? []).map((x) => x.toFixed(3)).join(', ') || '—';

function TopCountsHistogram({ run }: { run: QuantumRunDetail }) {
  const top = run.details.top_counts ?? [];
  if (top.length === 0) return null;
  const maxP = Math.max(...top.map((t) => t.probability)) || 1;

  return (
    <Card title="Most frequent measurement results">
      <p className="text-xs text-ink-muted mt-0 mb-3">
        Bit q = micro-zone q; 0 → side A, 1 → side B (qubit 0 is the rightmost). Green bars are
        optimal splits.
      </p>
      <div className="flex flex-col gap-1.5">
        {top.map((t) => {
          const optimal = run.optimal_energy != null && Math.abs(t.energy - run.optimal_energy) < 1e-9;
          return (
            <div key={t.bitstring} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <Code>{t.bitstring}</Code>
              <div className="h-3 rounded bg-panel overflow-hidden">
                <div
                  className={`h-full ${optimal ? 'bg-primary' : 'bg-ink-muted/40'}`}
                  style={{ width: `${(t.probability / maxP) * 100}%` }}
                />
              </div>
              <span className="text-xs text-ink-muted font-mono whitespace-nowrap">
                {t.count} · {formatPct(t.probability)} · E={formatNum(t.energy)}
                {optimal ? ' ✓' : ''}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function QuantumRunDetailPanel({ runId }: { runId: string }) {
  const { data: r, isLoading, isError } = useQuantumRun(runId);

  if (isLoading) {
    return <div className="h-[240px] rounded-lg border border-edge bg-card animate-skeleton" />;
  }
  if (isError || !r) {
    return <p className="form-error">Failed to load quantum run.</p>;
  }

  const d = r.details ?? {};
  const execution = d.execution ?? {};
  const circuit = d.circuit ?? {};
  const prepare = d.prepare ?? {};
  const lift = liftOverRandom(r);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card title="Request">
          <KeyValues
            rows={[
              ['Run ID', <Code key="id">{r.id}</Code>],
              ['Territory plan', <Code key="plan">{r.territory_plan_id}</Code>],
              ['Bisection step', `${r.step} · side A load share ${formatNum(d.target_fraction)}`],
              ['Provider', r.provider],
              ['Backend', r.backend_name ?? '—'],
              ['IBM job id', r.job_id ? <Code key="job">{r.job_id}</Code> : '—'],
              [
                'Status',
                <span key="status" className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={r.status} />
                  {r.error && <span className="text-xs text-danger">{r.error}</span>}
                </span>,
              ],
              ['Created', formatDate(r.created_at)],
              ['Submitted', formatDate(r.submitted_at) || '—'],
              ['Completed', formatDate(r.completed_at) || '—'],
              ...(execution.ibm_timestamps
                ? [[
                    'IBM timestamps',
                    Object.entries(execution.ibm_timestamps)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(' · '),
                  ] as [ReactNode, ReactNode]]
                : []),
              ...(execution.ibm_usage
                ? [['IBM usage', <Code key="usage">{JSON.stringify(execution.ibm_usage)}</Code>] as [ReactNode, ReactNode]]
                : []),
              ['QPU seconds', formatNum(r.qpu_seconds, 2)],
            ]}
          />
        </Card>

        <Card title="Circuit & problem">
          <KeyValues
            rows={[
              ['Qubits / terms', `${r.num_qubits} / ${r.num_terms}`],
              ['Micro-zones', (d.micro_zones ?? []).join(', ') || '—'],
              ['Graph edges', d.graph_edges ?? '—'],
              ['QAOA layers (p)', r.qaoa_reps],
              ['Shots', r.shots],
              [
                'Logical circuit',
                `depth ${r.logical_depth ?? '—'}, RZZ ${circuit.rzz_gates ?? '—'}, RX ${
                  circuit.rx_gates ?? '—'
                }, ≈CNOT ${circuit.cnot_equivalent ?? '—'}`,
              ],
              [
                'Transpiled',
                r.transpiled_depth != null
                  ? `depth ${r.transpiled_depth}, 2q gates ${r.transpiled_two_qubit_gates}${
                      prepare.physical_qubits ? `, physical qubits ${prepare.physical_qubits.join(',')}` : ''
                    }`
                  : '—',
              ],
              ...(prepare.gate_counts
                ? [['Gates', <Code key="gates">{JSON.stringify(prepare.gate_counts)}</Code>] as [ReactNode, ReactNode]]
                : []),
              ['Angles γ / β', `${joinFixed(d.gammas)} / ${joinFixed(d.betas)}`],
              ['Optimizer evaluations', r.optimizer_evaluations ?? '—'],
            ]}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card title="Timing">
          <PhaseBar run={r} className="mb-3" />
          <KeyValues
            rows={[
              ...PHASES.map((p) => [p.label, formatMs(phaseValue(r, p.key) || null)] as [ReactNode, ReactNode]),
              [<b key="t">Whole step</b>, <b key="v">{formatMs(r.total_ms)}</b>],
            ]}
          />
        </Card>

        <Card title="Result">
          <KeyValues
            rows={[
              [
                'Answer used in plan',
                <span
                  key="src"
                  className={r.chosen_source === 'quantum' ? 'text-primary-light font-semibold' : ''}
                >
                  {r.chosen_source ?? '—'}
                </span>,
              ],
              [
                'Best sample / optimum',
                <span key="best">
                  {formatNum(r.best_energy)} / {formatNum(r.optimal_energy)}
                  {d.best_sampled_bitstring && <> · <Code>{d.best_sampled_bitstring}</Code></>}
                </span>,
              ],
              [
                'Classical optimum',
                d.classical_best_bitstring ? (
                  <span key="cls">
                    <Code>{d.classical_best_bitstring}</Code> ({d.optimal_solutions ?? '—'} optimal
                    solutions)
                  </span>
                ) : (
                  '—'
                ),
              ],
              ['Mean sample energy', `${formatNum(r.expected_energy)} (ideal ${formatNum(d.ideal_expected_energy)})`],
              ['Approximation ratio', formatNum(r.approximation_ratio)],
              [
                'P(optimum)',
                `ideal QAOA ${formatPct(r.optimum_probability, 2)} · in shots ${formatPct(
                  r.sampled_optimum_frequency,
                  2,
                )} · random ${formatPct(d.uniform_optimum_probability, 2)}${
                  lift == null ? '' : ` (×${lift.toFixed(1)})`
                }`,
              ],
              [
                'Random shots would hit it',
                formatPct(randomHitProbability(d.uniform_optimum_probability, r.shots), 0),
              ],
              ['Unique bitstrings', r.unique_bitstrings ?? '—'],
            ]}
          />
        </Card>
      </div>

      <TopCountsHistogram run={r} />

      <details className="text-sm">
        <summary className="text-ink-muted cursor-pointer">Raw run data (JSON)</summary>
        <pre className="mt-2 max-h-[400px] overflow-auto bg-panel border border-edge rounded-lg p-3 text-xs text-ink-muted">
          {JSON.stringify(r, null, 2)}
        </pre>
      </details>
    </div>
  );
}
