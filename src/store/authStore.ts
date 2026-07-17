import { create } from 'zustand';

import type { AuthTokens } from '../features/auth/types';

const STORAGE_KEY = 'auth.accessToken';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(STORAGE_KEY),
  isAuthenticated: Boolean(localStorage.getItem(STORAGE_KEY)),
  login: (tokens) => {
    localStorage.setItem(STORAGE_KEY, tokens.accessToken);
    set({ token: tokens.accessToken, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, isAuthenticated: false });
  },
}));
