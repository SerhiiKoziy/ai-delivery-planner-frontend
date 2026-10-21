import type { ISODateString } from '../../types/common';

export type TerritorySolver = 'classical' | 'quantum_simulator' | 'ibm_emulator' | 'ibm_quantum';

export type TerritoryBalanceBy = 'stops' | 'weight';

export interface TerritoryPlanRequest {
  delivery_ids: string[];
  // One zone per vehicle, in this order: zone i belongs to vehicle_ids[i].
  vehicle_ids: string[];
  solver?: TerritorySolver;
  balance_by?: TerritoryBalanceBy;
  balance_weight?: number;
  qaoa_reps?: number;
  shots?: number;
}

export interface TerritoryZone {
  index: number;
  vehicle_id: string;
  plate_number: string | null;
  delivery_ids: string[];
  stop_count: number;
  load: number;
  centroid_lat: number | null;
  centroid_lng: number | null;
  radius_km: number;
}

export interface TerritoryPlanMetrics {
  max_load?: number;
  min_load?: number;
  // 1.0 = perfectly balanced; 1.5 = busiest zone has 50% more than average
  imbalance?: number;
  max_radius_km?: number;
  quantum_runs?: number;
  quantum_steps_used?: number;
  skipped_not_geocoded?: string[];
}

export interface TerritoryPlan {
  id: string;
  status: string;
  solver: TerritorySolver;
  balance_by: TerritoryBalanceBy;
  num_zones: number;
  num_deliveries: number;
  zones: TerritoryZone[];
  metrics: TerritoryPlanMetrics;
  error: string | null;
  total_ms: number | null;
  created_at: ISODateString;
  updated_at: ISODateString;
}
