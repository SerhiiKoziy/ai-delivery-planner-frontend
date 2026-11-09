import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/authStore';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';

vi.mock('../../../api/client', () => ({
  apiClient: { post: vi.fn() },
}));

function renderAt(ui: ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/form']}>
        <Routes>
          <Route path="/form" element={ui} />
          <Route path="/" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  it('rejects an invalid email without calling the API', async () => {
    renderAt(<ForgotPasswordForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: 'Send reset link' }));

    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('requests a reset link and shows the same confirmation for any email', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { message: 'ok' } });
    renderAt(<ForgotPasswordForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'someone@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Send reset link' }));

    expect(await screen.findByText(/we've sent a link to reset the password/)).toBeInTheDocument();
    expect(apiClient.post).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'someone@example.com',
    });
  });
});

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
    useAuthStore.setState({ token: null, isAuthenticated: false });
  });

  async function fill(password: string, confirm: string) {
    await userEvent.type(screen.getByLabelText('New password'), password);
    await userEvent.type(screen.getByLabelText('Confirm new password'), confirm);
    await userEvent.click(screen.getByRole('button', { name: 'Set new password' }));
  }

  it('validates length and confirmation before calling the API', async () => {
    renderAt(<ResetPasswordForm token="reset-token" />);

    await fill('short', 'different');

    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('sets the new password, logs in and opens the dashboard', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { access_token: 'new-access', refresh_token: 'new-refresh', token_type: 'bearer' },
    });
    renderAt(<ResetPasswordForm token="reset-token" />);

    await fill('new-password-123', 'new-password-123');

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(apiClient.post).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'reset-token',
      new_password: 'new-password-123',
    });
    expect(useAuthStore.getState()).toMatchObject({ token: 'new-access', isAuthenticated: true });
  });

  it('explains an expired link and offers a new one', async () => {
    vi.mocked(apiClient.post).mockRejectedValue({
      isAxiosError: true,
      response: { data: { detail: 'This password reset link is invalid or has expired' } },
    });
    renderAt(<ResetPasswordForm token="old-token" />);

    await fill('new-password-123', 'new-password-123');

    expect(await screen.findByText(/invalid or has expired/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request a new link' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
