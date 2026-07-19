import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '../../../api/client';
import type { ReplanResult } from '../types';
import { useReplan } from './useReplan';

vi.mock('../../../api/client', () => ({
  apiClient: { post: vi.fn() },
}));

const baseResult: ReplanResult = {
  route_id: 'r1',
  interpretation: {
    event_type: 'driver_delayed',
    affected_stop_sequence: null,
    new_window_start: null,
    new_window_end: null,
    delay_minutes: 20,
    summary: 'Driver delayed by 20 minutes.',
  },
  applied: true,
  diff: [],
  total_distance_km_before: 10,
  total_distance_km_after: 10,
  total_duration_minutes_before: 60,
  total_duration_minutes_after: 80,
  time_saved_minutes: -20,
  explanation: 'Pushed remaining stops back by 20 minutes.',
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { Wrapper, invalidateSpy };
}

describe('useReplan', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  it('does not invalidate the route query on a dry run', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: baseResult });
    const { Wrapper, invalidateSpy } = createWrapper();

    const { result } = renderHook(() => useReplan('r1'), { wrapper: Wrapper });
    result.current.mutate({ route_id: 'r1', message: 'driver is 20 min late', dry_run: true });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.post).toHaveBeenCalledWith('/ai/replan', {
      route_id: 'r1',
      message: 'driver is 20 min late',
      dry_run: true,
    });
    expect(invalidateSpy).not.toHaveBeenCalled();
  });

  it('invalidates the route query once the change is actually applied', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: baseResult });
    const { Wrapper, invalidateSpy } = createWrapper();

    const { result } = renderHook(() => useReplan('r1'), { wrapper: Wrapper });
    result.current.mutate({ route_id: 'r1', message: 'driver is 20 min late', dry_run: false });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['route', 'r1'] });
  });
});
