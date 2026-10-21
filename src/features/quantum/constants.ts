import type { QuantumRun } from './types';

type PhaseKey = 'build_ms' | 'classical_ms' | 'optimize_ms' | 'transpile_ms' | 'queue_ms' | 'execution_ms';

export const PHASES: { key: PhaseKey; label: string; color: string }[] = [
  { key: 'build_ms', label: 'Build QUBO', color: '#9fb8a8' },
  { key: 'classical_ms', label: 'Classical optimum', color: '#4ecdc4' },
  { key: 'optimize_ms', label: 'QAOA angle search', color: '#3fbb6f' },
  { key: 'transpile_ms', label: 'Transpile', color: '#c77dff' },
  { key: 'queue_ms', label: 'IBM queue', color: '#f2a541' },
  { key: 'execution_ms', label: 'Execution / sampling', color: '#5aa9e6' },
];

export function phaseValue(run: QuantumRun, key: PhaseKey): number {
  return run[key] ?? 0;
}

// Refresh cadence of the Quantum lab while the tab is open.
export const QUANTUM_REFETCH_MS = 15_000;
