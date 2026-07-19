export type BadgeVariant =
  | 'pending'
  | 'assigned'
  | 'in_transit'
  | 'delivered'
  | 'failed'
  | 'low'
  | 'normal'
  | 'high'
  | 'vip'
  | 'active'
  | 'inactive'
  | 'planned'
  | 'default';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  pending:    'bg-yellow-400/20 text-yellow-300',
  assigned:   'bg-blue-400/20 text-blue-300',
  in_transit: 'bg-primary-muted text-primary-light',
  delivered:  'bg-emerald-500/15 text-emerald-300',
  failed:     'bg-danger-muted text-danger',
  low:        'bg-ink-muted/20 text-ink-muted',
  normal:     'bg-blue-400/15 text-blue-300',
  high:       'bg-orange-400/20 text-orange-300',
  vip:        'bg-purple-400/20 text-purple-300',
  active:     'bg-primary-muted text-primary-light',
  inactive:   'bg-ink-muted/20 text-ink-muted',
  planned:    'bg-blue-400/15 text-blue-300',
  default:    'bg-ink-muted/20 text-ink-muted',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}
