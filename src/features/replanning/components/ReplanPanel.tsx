import { useState } from 'react';

import { Button } from '../../../components/shared';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { useReplan } from '../api/useReplan';
import type { StopDiffEntry } from '../types';

interface Props {
  routeId: string;
}

type Stage = 'idle' | 'previewed' | 'applied';

type StopDiffChangeKey = Exclude<StopDiffEntry['change'], 'unchanged'>;

const inputCls =
  'bg-panel border border-edge rounded-lg px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary transition-colors';

const CHANGE_STYLES: Record<StopDiffChangeKey, string> = {
  reordered: 'bg-blue-400/15 text-blue-300',
  time_shifted: 'bg-orange-400/20 text-orange-300',
  removed: 'bg-danger-muted text-danger',
  window_updated: 'bg-purple-400/20 text-purple-300',
};

const CHANGE_LABELS: Record<StopDiffChangeKey, string> = {
  reordered: 'Reordered',
  time_shifted: 'Time shifted',
  removed: 'Removed',
  window_updated: 'Window updated',
};

function fmtTime(t: string | null) {
  return t ? t.slice(0, 5) : '—';
}

function fmtDuration(minutes: number) {
  const sign = minutes < 0 ? '-' : '';
  const abs = Math.abs(Math.round(minutes));
  return `${sign}${Math.floor(abs / 60)}h ${abs % 60}m`;
}

export function ReplanPanel({ routeId }: Props) {
  const [message, setMessage] = useState('');
  const [previewMessage, setPreviewMessage] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('idle');
  const replan = useReplan(routeId);

  const result = replan.data;
  const changedStops = result?.diff.filter((entry) => entry.change !== 'unchanged') ?? [];

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || replan.isPending) return;
    setPreviewMessage(trimmed);
    replan.mutate(
      { route_id: routeId, message: trimmed, dry_run: true },
      { onSuccess: () => setStage('previewed') },
    );
  };

  const handleApply = () => {
    if (!previewMessage || replan.isPending) return;
    replan.mutate(
      { route_id: routeId, message: previewMessage, dry_run: false },
      { onSuccess: () => setStage('applied') },
    );
  };

  const handleReset = () => {
    setMessage('');
    setPreviewMessage(null);
    setStage('idle');
    replan.reset();
  };

  return (
    <div className="bg-card border border-edge rounded-lg p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-ink">AI Replanning</span>
        {stage !== 'idle' && (
          <button
            className="text-xs text-primary hover:underline bg-transparent border-none cursor-pointer"
            onClick={handleReset}
          >
            New message
          </button>
        )}
      </div>

      {stage === 'idle' && (
        <form className="flex gap-2" onSubmit={handlePreview}>
          <input
            className={`${inputCls} flex-1`}
            placeholder="e.g. Customer at stop 3 is unreachable, or driver is running 20 minutes late"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={replan.isPending}
          />
          <Button type="submit" disabled={replan.isPending || !message.trim()}>
            {replan.isPending ? 'Interpreting…' : 'Preview'}
          </Button>
        </form>
      )}

      {replan.isError && (
        <p className="text-sm text-danger">
          {getApiErrorMessage(replan.error, 'Failed to process the replan request.')}
        </p>
      )}

      {result && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink-muted italic">"{previewMessage}"</p>

          {!result.applied ? (
            <p className="text-sm text-ink bg-panel border border-edge rounded-lg px-3 py-2">
              {result.interpretation.summary}
            </p>
          ) : (
            <>
              <div className="flex gap-4 flex-wrap text-sm">
                <div>
                  <div className="text-[0.65rem] uppercase tracking-wider text-ink-muted">
                    Distance
                  </div>
                  <div className="font-semibold text-ink">
                    {result.total_distance_km_before.toFixed(1)} →{' '}
                    {result.total_distance_km_after.toFixed(1)} km
                  </div>
                </div>
                <div>
                  <div className="text-[0.65rem] uppercase tracking-wider text-ink-muted">
                    Duration
                  </div>
                  <div className="font-semibold text-ink">
                    {fmtDuration(result.total_duration_minutes_before)} →{' '}
                    {fmtDuration(result.total_duration_minutes_after)}
                  </div>
                </div>
                <div>
                  <div className="text-[0.65rem] uppercase tracking-wider text-ink-muted">
                    Time saved
                  </div>
                  <div className="font-semibold text-ink">
                    {fmtDuration(result.time_saved_minutes)}
                  </div>
                </div>
              </div>

              {changedStops.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {changedStops.map((entry) => (
                    <div
                      key={entry.delivery_id}
                      className="flex items-center gap-2 text-sm bg-panel border border-edge rounded-lg px-3 py-2"
                    >
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                          CHANGE_STYLES[entry.change as StopDiffChangeKey]
                        }`}
                      >
                        {CHANGE_LABELS[entry.change as StopDiffChangeKey]}
                      </span>
                      <span className="text-ink flex-1">{entry.customer_name}</span>
                      <span className="font-mono text-xs text-ink-muted">
                        {fmtTime(entry.old_estimated_arrival)} → {fmtTime(entry.new_estimated_arrival)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-muted">No stop changes.</p>
              )}

              <p className="text-sm text-ink">{result.explanation}</p>

              {stage === 'previewed' && (
                <div className="flex gap-2">
                  <Button onClick={handleApply} disabled={replan.isPending}>
                    {replan.isPending ? 'Applying…' : 'Apply changes'}
                  </Button>
                  <Button variant="secondary" onClick={handleReset} disabled={replan.isPending}>
                    Discard
                  </Button>
                </div>
              )}

              {stage === 'applied' && (
                <p className="text-sm text-emerald-300 font-semibold">✓ Changes applied to the route.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
