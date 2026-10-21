import type { ISODateString } from '../../types/common';

export interface QuantumRun {
  id: string;
  territory_plan_id: string;
  step: string;
  provider: string;
  backend_name: string | null;
  status: string;
  error: string | null;
  job_id: string | null;

  num_qubits: number;
  num_terms: number;
  qaoa_reps: number;
  shots: number;
  logical_depth: number | null;
  two_qubit_gates: number | null;
  transpiled_depth: number | null;
  transpiled_two_qubit_gates: number | null;
  optimizer_evaluations: number | null;

  build_ms: number | null;
  classical_ms: number | null;
  optimize_ms: number | null;
  transpile_ms: number | null;
  queue_ms: number | null;
  execution_ms: number | null;
  total_ms: number | null;
  qpu_seconds: number | null;

  expected_energy: number | null;
  best_energy: number | null;
  optimal_energy: number | null;
  approximation_ratio: number | null;
  optimum_probability: number | null;
  sampled_optimum_frequency: number | null;
  unique_bitstrings: number | null;
  chosen_source: string | null;
  uniform_optimum_probability: number | null;

  submitted_at: ISODateString | null;
  completed_at: ISODateString | null;
  created_at: ISODateString;
}

export interface TopCount {
  bitstring: string;
  count: number;
  probability: number;
  energy: number;
}

// Free-form on the backend; these are the keys the run detail view reads.
export interface QuantumRunDetails {
  target_fraction?: number;
  micro_zones?: number[];
  graph_edges?: number;
  gammas?: number[];
  betas?: number[];
  circuit?: { rzz_gates?: number; rx_gates?: number; cnot_equivalent?: number };
  prepare?: { physical_qubits?: number[]; gate_counts?: Record<string, number> };
  execution?: {
    ibm_timestamps?: Record<string, string>;
    ibm_usage?: unknown;
  };
  top_counts?: TopCount[];
  best_sampled_bitstring?: string;
  classical_best_bitstring?: string;
  optimal_solutions?: number;
  ideal_expected_energy?: number;
  uniform_optimum_probability?: number;
  [key: string]: unknown;
}

export interface QuantumRunDetail extends QuantumRun {
  details: QuantumRunDetails;
}

export interface TimingStats {
  count: number;
  avg_ms: number | null;
  p50_ms: number | null;
  p95_ms: number | null;
  max_ms: number | null;
}

export interface SolverAvailability {
  available: boolean;
  reason: string | null;
}

export interface QuantumSummary {
  total_runs: number;
  runs_by_status: Record<string, number>;
  runs_by_provider: Record<string, number>;
  quantum_matched_optimum_rate: number | null;
  avg_approximation_ratio: number | null;
  avg_optimum_probability: number | null;
  avg_uniform_optimum_probability: number | null;
  avg_sampled_optimum_frequency: number | null;
  // sampled optimum frequency / uniform optimum probability: 1.0 = no better than random
  avg_lift_over_random: number | null;
  avg_random_hit_probability: number | null;
  total_shots: number;
  timings: Record<string, TimingStats>;
  qpu_seconds_this_month: number;
  qpu_monthly_budget_seconds: number;
  last_run_at: ISODateString | null;
  solvers: Record<string, SolverAvailability>;
}
