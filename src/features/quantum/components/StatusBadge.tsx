import { Badge } from '../../../components/shared';
import type { BadgeVariant } from '../../../components/shared';

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  completed: 'delivered',
  running: 'in_transit',
  submitted: 'assigned',
  pending: 'pending',
  failed: 'failed',
  fallback: 'high',
};

/** Status of a territory plan or a quantum run. */
export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={STATUS_VARIANTS[status] ?? 'default'}>{status}</Badge>;
}
