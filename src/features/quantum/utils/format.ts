import type { QuantumRun } from '../types';

export function formatMs(value: number | null | undefined): string {
  if (value == null) return '—';
  if (value >= 60_000) return `${(value / 60_000).toFixed(1)} min`;
  if (value >= 1000) return `${(value / 1000).toFixed(2)} s`;
  return `${value.toFixed(value < 10 ? 1 : 0)} ms`;
}

export function formatPct(value: number | null | undefined, digits = 1): string {
  return value == null ? '—' : `${(value * 100).toFixed(digits)}%`;
}

export function formatNum(value: number | null | undefined, digits = 3): string {
  return value == null ? '—' : Number(value).toFixed(digits);
}

/** How many times more often QAOA sampled an optimum than random bitstrings would. */
export function liftOverRandom(run: QuantumRun): number | null {
  if (run.sampled_optimum_frequency == null || !run.uniform_optimum_probability) return null;
  return run.sampled_optimum_frequency / run.uniform_optimum_probability;
}

/** Chance that `shots` uniformly random bitstrings contain an optimum at least once. */
export function randomHitProbability(
  uniformOptimumProbability: number | null | undefined,
  shots: number,
): number | null {
  if (uniformOptimumProbability == null) return null;
  return 1 - (1 - uniformOptimumProbability) ** shots;
}
