import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '../../../api/client';
import type { Delivery, DeliveryCreate } from '../types';
import { useCreateDelivery } from './useCreateDelivery';

vi.mock('../../../api/client', () => ({
  apiClient: { post: vi.fn() },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useCreateDelivery', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  it('posts the payload to /deliveries and resolves with the created delivery', async () => {
    const payload: DeliveryCreate = {
      customer_name: 'Acme Corp',
      address: '123 Main St',
    };
    const created: Delivery = {
      id: 'd1',
      customer_name: 'Acme Corp',
      phone: null,
      address: '123 Main St',
      order_number: null,
      priority: 'normal',
      unloading_minutes: 0,
      weight_kg: 0,
      volume_m3: 0,
      delivery_window_start: null,
      delivery_window_end: null,
      notes: null,
      latitude: null,
      longitude: null,
      status: 'pending',
      created_at: '2026-07-19T00:00:00Z',
      updated_at: '2026-07-19T00:00:00Z',
    };
    vi.mocked(apiClient.post).mockResolvedValue({ data: created });

    const { result } = renderHook(() => useCreateDelivery(), { wrapper: createWrapper() });

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.post).toHaveBeenCalledWith('/deliveries', payload);
    expect(result.current.data).toEqual(created);
  });

  it('surfaces the error when the request fails', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useCreateDelivery(), { wrapper: createWrapper() });

    result.current.mutate({ customer_name: 'Acme Corp', address: '123 Main St' });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error('network error'));
  });
});
