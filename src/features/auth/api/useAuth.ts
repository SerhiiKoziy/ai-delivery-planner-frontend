import { useMutation } from '@tanstack/react-query';

import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/authStore';
import type { AuthTokens, LoginRequest, RegisterRequest } from '../types';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

function toAuthTokens(response: TokenResponse): AuthTokens {
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    tokenType: response.token_type,
  };
}

async function login(request: LoginRequest): Promise<AuthTokens> {
  const { data } = await apiClient.post<TokenResponse>('/auth/login', request);
  return toAuthTokens(data);
}

async function register(request: RegisterRequest): Promise<AuthTokens> {
  const { data } = await apiClient.post<TokenResponse>('/auth/register', request);
  return toAuthTokens(data);
}

export function useAuth() {
  const storeLogin = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: storeLogin,
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: storeLogin,
  });

  return { login: loginMutation, register: registerMutation, logout };
}
