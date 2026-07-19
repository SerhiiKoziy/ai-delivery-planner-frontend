export type ReplanEventType =
  | 'customer_unreachable'
  | 'delivery_cancelled'
  | 'delivery_rescheduled'
  | 'driver_delayed'
  | 'unrecognized';

export interface ReplanInterpretation {
  event_type: ReplanEventType;
  affected_stop_sequence: number | null;
  new_window_start: string | null;
  new_window_end: string | null;
  delay_minutes: number | null;
  summary: string;
}

export type StopDiffChange =
  | 'unchanged'
  | 'reordered'
  | 'time_shifted'
  | 'removed'
  | 'window_updated';

export interface StopDiffEntry {
  delivery_id: string;
  customer_name: string;
  change: StopDiffChange;
  old_sequence: number | null;
  new_sequence: number | null;
  old_estimated_arrival: string | null;
  new_estimated_arrival: string | null;
  reason: string | null;
}

export interface ReplanRequest {
  route_id: string;
  message: string;
  dry_run?: boolean;
}

export interface ReplanResult {
  route_id: string;
  interpretation: ReplanInterpretation;
  applied: boolean;
  diff: StopDiffEntry[];
  total_distance_km_before: number;
  total_distance_km_after: number;
  total_duration_minutes_before: number;
  total_duration_minutes_after: number;
  time_saved_minutes: number;
  explanation: string;
}
