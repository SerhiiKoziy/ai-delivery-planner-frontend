import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import type { OptimizeRequest, OptimizeResult } from '../types';

async function optimizeRoutes(payload: OptimizeRequest): Promise<OptimizeResult> {
  const { data } = await apiClient.post<OptimizeResult>('/routes/optimize', payload);
  return data;
}

export function useOptimizeRoutes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: optimizeRoutes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
