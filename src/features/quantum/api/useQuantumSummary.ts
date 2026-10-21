import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import type { QuantumSummary } from '../types';

async function fetchQuantumSummary(): Promise<QuantumSummary> {
  const { data } = await apiClient.get<QuantumSummary>('/quantum/summary');
  return data;
}

export function useQuantumSummary(options: { refetchInterval?: number | false } = {}) {
  return useQuery({
    queryKey: ['quantum', 'summary'],
    queryFn: fetchQuantumSummary,
    refetchInterval: options.refetchInterval,
  });
}
