import type { TerritorySolver } from './types';

export const SOLVER_LABELS: Record<TerritorySolver, string> = {
  classical: 'Classical (exact)',
  quantum_simulator: 'Quantum simulator (noise-free)',
  ibm_emulator: 'IBM emulator (noisy fake device)',
  ibm_quantum: 'Real IBM quantum computer',
};

export const SOLVERS = Object.keys(SOLVER_LABELS) as TerritorySolver[];

// Distinct, readable on the dark map/table background; zone i uses colour i % length.
export const ZONE_COLORS = [
  '#3fbb6f',
  '#5aa9e6',
  '#f2a541',
  '#c77dff',
  '#ef6f6c',
  '#4ecdc4',
  '#ffd166',
  '#f78fb3',
];

export function zoneColor(index: number): string {
  return ZONE_COLORS[index % ZONE_COLORS.length];
}
