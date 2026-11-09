import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '../api/client';
import type { CurrentUser, UserRole } from '../features/auth';
import { useAuthStore } from '../store/authStore';
import { AdminRoute } from './AppRouter';

vi.mock('../api/client', () => ({
  apiClient: { get: vi.fn() },
}));

function mockMe(role: UserRole) {
  const user: CurrentUser = {
    id: 'u1',
    email: 'someone@example.com',
    organizationId: 'o1',
    role,
    isVerified: true,
  };
  vi.mocked(apiClient.get).mockResolvedValue({ data: user });
}

function renderAdminRoute() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/quantum']}>
        <Routes>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route
            path="/quantum"
            element={
              <AdminRoute>
                <div>Quantum lab</div>
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    useAuthStore.setState({ token: 'fake-token', isAuthenticated: true });
  });

  it('renders the page for admins', async () => {
    mockMe('admin');

    renderAdminRoute();

    expect(await screen.findByText('Quantum lab')).toBeInTheDocument();
    expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
  });

  it('sends regular users to the dashboard', async () => {
    mockMe('user');

    renderAdminRoute();

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Quantum lab')).not.toBeInTheDocument();
  });

  it('shows nothing while the role is still loading', () => {
    vi.mocked(apiClient.get).mockReturnValue(new Promise(() => {}));

    renderAdminRoute();

    expect(screen.queryByText('Quantum lab')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
