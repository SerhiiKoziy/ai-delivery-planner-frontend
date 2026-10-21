import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import type { TerritoryPlan } from '../types';

async function fetchTerritoryPlan(id: string): Promise<TerritoryPlan> {
  const { data } = await apiClient.get<TerritoryPlan>(`/territories/plans/${id}`);
  return data;
}

export function useTerritoryPlan(id: string | undefined) {
  return useQuery({
    queryKey: ['territory-plan', id],
    queryFn: () => fetchTerritoryPlan(id!),
    enabled: Boolean(id),
  });
}
