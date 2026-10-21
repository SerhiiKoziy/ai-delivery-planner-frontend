import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import type { TerritoryPlan } from '../types';

async function fetchTerritoryPlans(): Promise<TerritoryPlan[]> {
  const { data } = await apiClient.get<TerritoryPlan[]>('/territories/plans');
  return data;
}

export function useTerritoryPlans() {
  return useQuery({
    queryKey: ['territory-plans'],
    queryFn: fetchTerritoryPlans,
  });
}
