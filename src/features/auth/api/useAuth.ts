import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/authStore';
import type { AuthTokens, LoginRequest, RegisterRequest, RegisterResult } from '../types';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface RegisterResponse {
  user_id: string;
  email: string;
  message: string;
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

async function register(request: RegisterRequest): Promise<RegisterResult> {
  const { data } = await apiClient.post<RegisterResponse>('/auth/register', request);
  return { userId: data.user_id, email: data.email, message: data.message };
}

export function useAuth() {
  const storeLogin = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (tokens) => {
      storeLogin(tokens);
      navigate('/');
    },
  });

  // Registration no longer logs the user in directly — the account stays
  // unverified until the emailed /verify-email link is followed (see
  // useVerifyEmail), so this mutation just reports whether the email was sent.
  const registerMutation = useMutation({
    mutationFn: register,
  });

  return { login: loginMutation, register: registerMutation, logout };
}
