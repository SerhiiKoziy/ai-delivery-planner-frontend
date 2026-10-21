import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import type { TerritoryPlan, TerritoryPlanRequest } from '../types';

async function createTerritoryPlan(payload: TerritoryPlanRequest): Promise<TerritoryPlan> {
  const { data } = await apiClient.post<TerritoryPlan>('/territories/plans', payload);
  return data;
}

export function useCreateTerritoryPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTerritoryPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['territory-plans'] });
      // A quantum solver logs one run per bisection step.
      queryClient.invalidateQueries({ queryKey: ['quantum'] });
    },
  });
}
