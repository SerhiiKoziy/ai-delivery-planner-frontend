import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/authStore';
import type { CurrentUser } from '../types';

async function fetchCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.get<CurrentUser>('/auth/me');
  return data;
}

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    // Keyed by token so a different login never sees the previous user's role.
    queryKey: ['auth-me', token],
    queryFn: fetchCurrentUser,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
  });
}

/** True only once /auth/me has confirmed the admin role (false while loading). */
export function useIsAdmin(): boolean {
  const { data } = useCurrentUser();
  return data?.role === 'admin';
}
