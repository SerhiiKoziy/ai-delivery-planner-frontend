import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import type { QuantumRun } from '../types';

interface Params {
  territoryPlanId?: string | null;
  limit?: number;
  refetchInterval?: number | false;
}

async function fetchQuantumRuns(limit: number, territoryPlanId?: string | null): Promise<QuantumRun[]> {
  const { data } = await apiClient.get<QuantumRun[]>('/quantum/runs', {
    params: { limit, territory_plan_id: territoryPlanId || undefined },
  });
  return data;
}

export function useQuantumRuns({ territoryPlanId, limit = 200, refetchInterval }: Params = {}) {
  return useQuery({
    queryKey: ['quantum', 'runs', { territoryPlanId: territoryPlanId ?? null, limit }],
    queryFn: () => fetchQuantumRuns(limit, territoryPlanId),
    refetchInterval,
  });
}
