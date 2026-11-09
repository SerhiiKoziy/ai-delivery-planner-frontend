import { useMutation } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/authStore';
import type { AuthTokens, ForgotPasswordRequest, ResetPasswordRequest } from '../types';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

async function requestPasswordReset(request: ForgotPasswordRequest): Promise<string> {
  const { data } = await apiClient.post<{ message: string }>('/auth/forgot-password', request);
  return data.message;
}

async function resetPassword(request: ResetPasswordRequest): Promise<AuthTokens> {
  const { data } = await apiClient.post<TokenResponse>('/auth/reset-password', {
    token: request.token,
    new_password: request.newPassword,
  });
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type,
  };
}

/** Step 1: ask the API to email a reset link. The answer is the same whether
 * or not the email has an account, so the UI never says which it was. */
export function useForgotPassword() {
  return useMutation({ mutationFn: requestPasswordReset });
}

/** Step 2: redeem the emailed token with a new password; the API logs the
 * user straight in, like email verification does. */
export function useResetPassword() {
  const storeLogin = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (tokens) => {
      storeLogin(tokens);
    },
  });
}
