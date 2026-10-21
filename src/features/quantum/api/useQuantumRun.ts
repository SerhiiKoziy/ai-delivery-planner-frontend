import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import type { QuantumRunDetail } from '../types';

async function fetchQuantumRun(id: string): Promise<QuantumRunDetail> {
  const { data } = await apiClient.get<QuantumRunDetail>(`/quantum/runs/${id}`);
  return data;
}

export function useQuantumRun(id: string | null) {
  return useQuery({
    queryKey: ['quantum', 'run', id],
    queryFn: () => fetchQuantumRun(id!),
    enabled: Boolean(id),
  });
}
