import { useMutation } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/authStore';
import type { AuthTokens } from '../types';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

async function verifyEmail(token: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<TokenResponse>('/auth/verify-email', { token });
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type,
  };
}

export function useVerifyEmail() {
  const storeLogin = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (tokens) => {
      storeLogin(tokens);
    },
  });
}
