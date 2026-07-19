import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import type { ReplanRequest, ReplanResult } from '../types';

async function requestReplan(payload: ReplanRequest): Promise<ReplanResult> {
  const { data } = await apiClient.post<ReplanResult>('/ai/replan', payload);
  return data;
}

export function useReplan(routeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestReplan,
    onSuccess: (_result, variables) => {
      // Only a non-dry-run call actually persists changes to the route.
      if (!variables.dry_run) {
        queryClient.invalidateQueries({ queryKey: ['route', routeId] });
      }
    },
  });
}
